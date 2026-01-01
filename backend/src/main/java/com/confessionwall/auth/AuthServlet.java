package com.example.confessionsapp.auth;

import com.example.confessionsapp.util.DBConnection;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import org.mindrot.jbcrypt.BCrypt;
import java.io.IOException;
import java.sql.*;

@WebServlet("/auth/*")
public class AuthServlet extends HttpServlet {

    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String path = req.getPathInfo();
        resp.setContentType("application/json");

        if ("/register".equals(path)) {
            handleRegister(req, resp);
        } else if ("/login".equals(path)) {
            handleLogin(req, resp);
        } else if ("/logout".equals(path)) {
            handleLogout(req, resp);
        }
    }

    private void handleRegister(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String user = req.getParameter("username");
        String pass = req.getParameter("password");

        try (Connection conn = DBConnection.getConnection()) {
            String hash = BCrypt.hashpw(pass, BCrypt.gensalt());
            PreparedStatement ps = conn.prepareStatement("INSERT INTO users (username, password) VALUES (?, ?)");
            ps.setString(1, user);
            ps.setString(2, hash);
            ps.executeUpdate();
            resp.getWriter().write("{\"message\": \"User Created\"}");
        } catch (SQLException e) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\": \"Username taken\"}");
        }
    }

    private void handleLogin(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String user = req.getParameter("username");
        String pass = req.getParameter("password");

        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("SELECT password FROM users WHERE username = ?");
            ps.setString(1, user);
            ResultSet rs = ps.executeQuery();

            if (rs.next() && BCrypt.checkpw(pass, rs.getString("password"))) {
                // Day 1: Session Creation
                HttpSession session = req.getSession(true);
                session.setAttribute("user", user);
                resp.getWriter().write("{\"message\": \"Logged in\", \"user\": \"" + user + "\"}");
            } else {
                resp.setStatus(401);
                resp.getWriter().write("{\"error\": \"Invalid credentials\"}");
            }
        } catch (Exception e) { resp.setStatus(500); }
    }

    private void handleLogout(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        HttpSession session = req.getSession(false);
        if (session != null) session.invalidate();
        resp.getWriter().write("{\"message\": \"Logged out\"}");
    }
}