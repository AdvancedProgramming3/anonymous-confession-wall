package com.confessionwall.servlets;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/auth/logout")
public class LogoutServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        HttpSession session = request.getSession(false);

        if (session != null) {
            session.invalidate(); // Destroy session
        }

        response.getWriter().write("{\"message\": \"Logout successful\"}");
    }
}