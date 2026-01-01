package com.confessionwall.util;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

public class JsonUtils {
    private static final ObjectMapper mapper = new ObjectMapper();

    public static void sendResponse(HttpServletResponse resp, int status, Object data) throws IOException {
        resp.setStatus(status);
        resp.setContentType("application/json");
        resp.getWriter().write(mapper.writeValueAsString(data));
    }

    public static void sendError(HttpServletResponse resp, int status, String message) throws IOException {
        sendResponse(resp, status, Map.of("error", message));
    }
}