plugins {
    id("com.android.application")
}

android {
    namespace = "com.matheus.financas"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.matheus.financas"
        minSdk = 23
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

tasks.register<Copy>("syncWebAssets") {
    from(rootProject.layout.projectDirectory.asFile.parentFile) {
        include("index.html")
        include("styles.css")
        include("app.js")
        include("manifest.webmanifest")
        include("service-worker.js")
        include("assets/**")
    }
    into(layout.projectDirectory.dir("src/main/assets"))
}

tasks.named("preBuild") {
    dependsOn("syncWebAssets")
}
