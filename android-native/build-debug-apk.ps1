$ErrorActionPreference = "Stop"

$androidRoot = (Resolve-Path $PSScriptRoot).Path
$repoRoot = (Resolve-Path (Join-Path $androidRoot "..")).Path
$sdkRoot = $env:ANDROID_HOME
if (-not $sdkRoot) { $sdkRoot = $env:ANDROID_SDK_ROOT }
if (-not $sdkRoot) { $sdkRoot = Join-Path $env:LOCALAPPDATA "Android\Sdk" }
$sdkRoot = (Resolve-Path $sdkRoot).Path

$javaHome = $env:JAVA_HOME
if (-not $javaHome) { $javaHome = "C:\Program Files\Android\Android Studio\jbr" }
$javaHome = (Resolve-Path $javaHome).Path
$env:JAVA_HOME = $javaHome
$env:PATH = (Join-Path $javaHome "bin") + ";" + $env:PATH

$platform = Get-ChildItem -Path (Join-Path $sdkRoot "platforms") -Directory |
    Where-Object { Test-Path (Join-Path $_.FullName "android.jar") } |
    Sort-Object Name -Descending |
    Select-Object -First 1
if (-not $platform) { throw "Android SDK platform nao encontrado." }

$buildTools = Get-ChildItem -Path (Join-Path $sdkRoot "build-tools") -Directory |
    Where-Object {
        (Test-Path (Join-Path $_.FullName "aapt2.exe")) -and
        (Test-Path (Join-Path $_.FullName "d8.bat")) -and
        (Test-Path (Join-Path $_.FullName "zipalign.exe")) -and
        (Test-Path (Join-Path $_.FullName "apksigner.bat"))
    } |
    Sort-Object Name -Descending |
    Select-Object -First 1
if (-not $buildTools) { throw "Android Build Tools nao encontrado." }

$androidJar = Join-Path $platform.FullName "android.jar"
$aapt2 = Join-Path $buildTools.FullName "aapt2.exe"
$d8 = Join-Path $buildTools.FullName "d8.bat"
$zipalign = Join-Path $buildTools.FullName "zipalign.exe"
$apksigner = Join-Path $buildTools.FullName "apksigner.bat"
$javac = Join-Path $javaHome "bin\javac.exe"
$jar = Join-Path $javaHome "bin\jar.exe"
$keytool = Join-Path $javaHome "bin\keytool.exe"

$manualBuild = Join-Path $androidRoot "app\build\manual"
$resolvedManualParent = (Resolve-Path (Join-Path $androidRoot "app")).Path
if (Test-Path $manualBuild) {
    $resolvedManualBuild = (Resolve-Path $manualBuild).Path
    if (-not $resolvedManualBuild.StartsWith($resolvedManualParent)) {
        throw "Build dir fora da pasta esperada."
    }
    Remove-Item -LiteralPath $resolvedManualBuild -Recurse -Force
}

$assetsRoot = Join-Path $androidRoot "app\src\main\assets"
if (Test-Path $assetsRoot) {
    $resolvedAssetsDir = (Resolve-Path $assetsRoot).Path
    if (-not $resolvedAssetsDir.StartsWith($androidRoot)) {
        throw "Assets dir fora da pasta esperada."
    }
    Remove-Item -LiteralPath $resolvedAssetsDir -Recurse -Force
}

$compiledDir = Join-Path $manualBuild "compiled"
$generatedDir = Join-Path $manualBuild "generated"
$classesDir = Join-Path $manualBuild "classes"
$dexDir = Join-Path $manualBuild "dex"
$outputsDir = Join-Path $androidRoot "app\build\outputs\apk\debug"
New-Item -ItemType Directory -Force -Path $compiledDir, $generatedDir, $classesDir, $dexDir, $outputsDir, $assetsRoot | Out-Null

foreach ($file in @("index.html", "styles.css", "app.js", "manifest.webmanifest", "service-worker.js")) {
    Copy-Item -LiteralPath (Join-Path $repoRoot $file) -Destination $assetsRoot -Force
}
Copy-Item -LiteralPath (Join-Path $repoRoot "assets") -Destination $assetsRoot -Recurse -Force

$resDir = Join-Path $androidRoot "app\src\main\res"
$manifest = Join-Path $androidRoot "app\src\main\AndroidManifest.xml"
$preparedManifest = Join-Path $manualBuild "AndroidManifest.xml"
$compiledResources = Join-Path $compiledDir "resources.zip"
$unsignedApk = Join-Path $manualBuild "financas-unsigned.apk"
$alignedApk = Join-Path $manualBuild "financas-aligned.apk"
$signedApk = Join-Path $outputsDir "financas-pessoais-debug.apk"
$classesJar = Join-Path $manualBuild "classes.jar"

& $aapt2 compile --dir $resDir -o $compiledResources
if ($LASTEXITCODE -ne 0) { throw "Falha ao compilar resources." }

$manifestText = Get-Content -LiteralPath $manifest -Raw
if ($manifestText -notmatch "<manifest[^>]*\spackage=") {
    $manifestText = $manifestText -replace "<manifest ", "<manifest package=`"com.matheus.financas`" "
}
Set-Content -LiteralPath $preparedManifest -Value $manifestText -Encoding UTF8

& $aapt2 link `
    -o $unsignedApk `
    -I $androidJar `
    --manifest $preparedManifest `
    -R $compiledResources `
    --java $generatedDir `
    -A $assetsRoot `
    --min-sdk-version 23 `
    --target-sdk-version 36 `
    --version-code 1 `
    --version-name 1.0 `
    --debug-mode `
    --custom-package com.matheus.financas `
    --rename-manifest-package com.matheus.financas `
    --auto-add-overlay
if ($LASTEXITCODE -ne 0) { throw "Falha ao empacotar resources." }

$javaSources = Get-ChildItem -Path (Join-Path $androidRoot "app\src\main\java"), $generatedDir -Recurse -Filter "*.java" |
    ForEach-Object { $_.FullName }
$sourceList = Join-Path $manualBuild "sources.txt"
$javaSources | ForEach-Object { '"' + ($_ -replace "\\", "/") + '"' } | Set-Content -LiteralPath $sourceList -Encoding ASCII

& $javac -encoding UTF-8 -source 8 -target 8 -classpath $androidJar -d $classesDir "@$sourceList"
if ($LASTEXITCODE -ne 0) { throw "Falha ao compilar Java." }

& $jar cf $classesJar -C $classesDir "."
if ($LASTEXITCODE -ne 0) { throw "Falha ao preparar classes." }

& $d8 --min-api 23 --lib $androidJar --output $dexDir $classesJar
if ($LASTEXITCODE -ne 0) { throw "Falha ao gerar DEX." }

& $jar uf $unsignedApk -C $dexDir "classes.dex"
if ($LASTEXITCODE -ne 0) { throw "Falha ao adicionar DEX no APK." }

& $zipalign -f -p 4 $unsignedApk $alignedApk
if ($LASTEXITCODE -ne 0) { throw "Falha no zipalign." }

$keystoreDir = Join-Path $androidRoot "app\build\debug-keystore"
$keystore = Join-Path $keystoreDir "debug.keystore"
New-Item -ItemType Directory -Force -Path $keystoreDir | Out-Null
if (-not (Test-Path $keystore)) {
    & $keytool -genkeypair `
        -keystore $keystore `
        -storepass android `
        -keypass android `
        -alias androiddebugkey `
        -keyalg RSA `
        -keysize 2048 `
        -validity 10000 `
        -dname "CN=Android Debug,O=Android,C=US"
    if ($LASTEXITCODE -ne 0) { throw "Falha ao criar chave debug." }
}

& $apksigner sign `
    --min-sdk-version 23 `
    --v1-signing-enabled true `
    --v2-signing-enabled true `
    --v3-signing-enabled true `
    --ks $keystore `
    --ks-pass pass:android `
    --key-pass pass:android `
    --out $signedApk `
    $alignedApk
if ($LASTEXITCODE -ne 0) { throw "Falha ao assinar APK." }

& $apksigner verify --verbose $signedApk
if ($LASTEXITCODE -ne 0) { throw "Falha ao verificar assinatura." }

Write-Output $signedApk
