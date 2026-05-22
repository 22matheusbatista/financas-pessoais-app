# Android

Este projeto Android empacota o app web atual em uma tela nativa com WebView e adiciona uma ponte para ler notificacoes financeiras do celular.

## Como funciona

- O app abre a mesma interface que ja existe no navegador.
- A tela "Avisos" pode abrir as configuracoes de acesso a notificacoes do Android.
- Quando uma notificacao financeira chega, o Android tenta identificar valor, banco, final do cartao, estabelecimento, data, forma de pagamento e categoria.
- Nada e salvo direto: o lancamento entra em "Lancamentos pendentes" para confirmar, editar ou ignorar.
- As informacoes ficam locais no aparelho.

## Por que notificacoes em vez de SMS direto

Permissoes de SMS sao muito restritas na Google Play. Para publicar sem risco, este projeto nao inclui `READ_SMS` nem `RECEIVE_SMS` por padrao. O fluxo inicial usa `NotificationListenerService`, com autorizacao manual do usuario nas configuracoes do Android.

## Como rodar no celular

1. Instale o Android Studio atual com JDK 17.
2. Abra a pasta `android-native` no Android Studio.
3. Aguarde a sincronizacao do Gradle.
4. Conecte o celular com depuracao USB ativa.
5. Clique em Run.
6. No app, abra "Avisos" e toque em "Configurar leitura".
7. Nas configuracoes do Android, ative o acesso a notificacoes para "Financas Pessoais".
8. Quando chegar uma notificacao de banco/cartao com valor visivel, ela deve aparecer como pendente no app.

## Observacoes importantes

- Alguns bancos ocultam valor ou estabelecimento na notificacao. Nesses casos, o app nao consegue montar o lancamento.
- O app nao confirma compras sozinho. Ele sempre pede revisao manual.
- Para usar SMS real fora da Play Store, podemos criar um modulo separado depois, mas isso exige uma decisao consciente por causa das regras de privacidade e publicacao.
