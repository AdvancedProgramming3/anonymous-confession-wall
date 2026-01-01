package com.example.confessionsapp.controller;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/api/ping") // Replaces @GetMapping("/api/ping")
public class PingServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws IOException {

        // Set the response type to text
        response.setContentType("text/plain");

        // Write the data directly to the response body
        String message = "Backend is working! Time: " + java.time.LocalDateTime.now();
        response.getWriter().write(message);
    }
}