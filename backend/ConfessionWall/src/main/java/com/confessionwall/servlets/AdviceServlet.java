package com.example.advice;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.BufferedReader;
import java.io.IOException;
import org.json.JSONObject;

@WebServlet("/api/advice")
public class AdviceServlet extends HttpServlet {

    private AdviceDao adviceDao = new AdviceDao();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("application/json");

        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) sb.append(line);
        }
        JSONObject body = new JSONObject(sb.toString());

        String content = body.optString("content", "").trim();

        if (content.isEmpty()) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\":\"Content is required\"}");
            return;
        }

        int fakeUserId = 1; // replace later with real session user

        boolean ok = adviceDao.createAdvice(content, fakeUserId);

        if (ok) {
            resp.setStatus(201);
            resp.getWriter().write("{\"message\":\"Advice created\"}");
        } else {
            resp.setStatus(500);
            resp.getWriter().write("{\"error\":\"Failed to save advice\"}");
        }
    }
}
