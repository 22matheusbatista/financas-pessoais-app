package com.matheus.financas;

import org.json.JSONObject;

import java.text.Normalizer;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

final class FinancialNotificationParser {
    private static final Pattern MONEY_PATTERN = Pattern.compile("R\\$\\s*([0-9.]+,[0-9]{2})");
    private static final Pattern CARD_LAST_DIGITS_PATTERN = Pattern.compile("final\\s*(\\d{4})", Pattern.CASE_INSENSITIVE);
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd", Locale.US);

    private FinancialNotificationParser() {
    }

    static JSONObject parse(String packageName, String title, String message, long postTime) {
        String raw = clean(message);
        String normalized = normalize(packageName + " " + title + " " + raw);

        if (!looksFinancial(normalized)) return null;

        Double amount = extractAmount(raw);
        if (amount == null || amount <= 0) return null;

        String cardLastDigits = extractCardLastDigits(raw);
        String merchant = extractMerchant(raw, title);
        String bankId = inferBankId(normalized);
        String type = isCard(normalized, cardLastDigits) ? "card" : "cash";
        String paymentMethod = inferPaymentMethod(normalized, type);

        try {
            JSONObject event = new JSONObject();
            event.put("id", UUID.randomUUID().toString());
            event.put("source", "android-notification");
            event.put("rawMessage", raw);
            event.put("title", clean(title));
            event.put("bankId", bankId);
            event.put("amount", amount);
            event.put("date", DATE_FORMAT.format(new Date(postTime)));
            event.put("merchant", merchant);
            event.put("categoryId", suggestCategory(merchant + " " + raw));
            event.put("type", type);
            event.put("paymentMethod", paymentMethod);
            event.put("cardLastDigits", cardLastDigits);
            return event;
        } catch (Exception ignored) {
            return null;
        }
    }

    private static boolean looksFinancial(String value) {
        return value.contains("compra")
                || value.contains("aprovad")
                || value.contains("cartao")
                || value.contains("credito")
                || value.contains("debito")
                || value.contains("pix")
                || value.contains("pagamento")
                || value.contains("transferencia")
                || value.contains("valor");
    }

    private static Double extractAmount(String value) {
        Matcher matcher = MONEY_PATTERN.matcher(value);
        if (!matcher.find()) return null;
        String number = matcher.group(1).replace(".", "").replace(",", ".");
        try {
            return Double.parseDouble(number);
        } catch (NumberFormatException ignored) {
            return null;
        }
    }

    private static String extractCardLastDigits(String value) {
        Matcher matcher = CARD_LAST_DIGITS_PATTERN.matcher(value);
        return matcher.find() ? matcher.group(1) : "";
    }

    private static String extractMerchant(String message, String title) {
        String compact = clean(message);
        String merchant = firstMatch(compact, "\\bem\\s+([^.,\\n]+)");
        if (merchant.isEmpty()) merchant = firstMatch(compact, "\\bpara\\s+([^.,\\n]+)");
        if (merchant.isEmpty()) merchant = clean(title);
        return merchant.isEmpty() ? "Lancamento detectado" : limit(cleanMerchant(merchant), 60);
    }

    private static String firstMatch(String value, String pattern) {
        Matcher matcher = Pattern.compile(pattern, Pattern.CASE_INSENSITIVE).matcher(value);
        return matcher.find() ? matcher.group(1) : "";
    }

    private static String inferBankId(String value) {
        if (value.contains("nubank") || value.contains("nu bank")) return "nubank";
        if (value.contains("inter")) return "inter";
        if (value.contains("itau")) return "itau";
        if (value.contains("bradesco")) return "bradesco";
        if (value.contains("santander")) return "santander";
        if (value.contains("banco do brasil") || value.contains("com.bb")) return "bb";
        if (value.contains("caixa")) return "caixa";
        if (value.contains("c6")) return "c6";
        if (value.contains("picpay")) return "picpay";
        return "other";
    }

    private static boolean isCard(String value, String cardLastDigits) {
        return !cardLastDigits.isEmpty()
                || value.contains("cartao")
                || value.contains("credito")
                || value.contains("fatura");
    }

    private static String inferPaymentMethod(String value, String type) {
        if ("card".equals(type)) return "Cartao";
        if (value.contains("debito")) return "Debito";
        if (value.contains("dinheiro")) return "Dinheiro";
        return "Pix";
    }

    private static String suggestCategory(String value) {
        String normalized = normalize(value);
        if (containsAny(normalized, "ifood", "restaurante", "padaria", "lanchonete")) return "cat-food";
        if (containsAny(normalized, "mercado", "supermercado", "extra", "atacadao")) return "cat-market";
        if (containsAny(normalized, "uber", "99", "posto", "combustivel")) return "cat-transport";
        if (containsAny(normalized, "netflix", "spotify", "prime", "assinatura")) return "cat-bills";
        if (containsAny(normalized, "farmacia", "drogaria", "saude")) return "cat-health";
        if (containsAny(normalized, "curso", "faculdade", "livro")) return "cat-study";
        return "cat-other-expense";
    }

    private static boolean containsAny(String value, String... words) {
        for (String word : words) {
            if (value.contains(word)) return true;
        }
        return false;
    }

    private static String cleanMerchant(String value) {
        return clean(value)
                .replaceAll("(?i)no valor de.*$", "")
                .replaceAll("(?i)cartao.*$", "")
                .trim();
    }

    private static String clean(String value) {
        return value == null ? "" : value.replaceAll("\\s+", " ").trim();
    }

    private static String normalize(String value) {
        String lower = clean(value).toLowerCase(Locale.ROOT);
        String normalized = Normalizer.normalize(lower, Normalizer.Form.NFD);
        return normalized.replaceAll("\\p{M}", "");
    }

    private static String limit(String value, int size) {
        return value.length() <= size ? value : value.substring(0, size).trim();
    }
}
