package com.confessionwall.confessions;

import com.confessionwall.util.*;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.*;
import java.util.*;

@WebServlet(urlPatterns = {"/api/confessions", "/api/protected/post"})
public class ConfessionServlet extends HttpServlet {

    // GET /api/confessions (Public)
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        List<Map<String, String>> list = new ArrayList<>();
        try (Connection conn = DBConnection.getConnection()) {
            ResultSet rs = conn.createStatement().executeQuery("SELECT * FROM confessions ORDER BY created_at DESC");
            while (rs.next()) {
                list.add(Map.of("id", rs.getString("id"), "content", rs.getString("content")));
            }
            JsonUtils.sendResponse(resp, 200, list);
        } catch (SQLException e) { JsonUtils.sendError(resp, 500, "Error fetching confessions"); }
    }

    // POST /api/protected/post (Locked by AuthFilter)
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        String content = req.getParameter("content");
        try (Connection conn = DBConnection.getConnection()) {
            PreparedStatement ps = conn.prepareStatement("INSERT INTO confessions (content) VALUES (?)");
            ps.setString(1, content);
            ps.executeUpdate();
            JsonUtils.sendResponse(resp, 201, Map.of("message", "Confession posted anonymously"));
        } catch (SQLException e) { JsonUtils.sendError(resp, 500, "Error saving confession"); }
    }
}