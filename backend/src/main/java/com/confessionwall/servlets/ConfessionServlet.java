package com.example.confessionsapp.confessions;

import com.example.confessionsapp.util.DBConnection;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.sql.*;

@WebServlet(urlPatterns = {"/public/view", "/protected/post"})
public class ConfessionServlet extends HttpServlet {

	// POST /protected/post (Only works if logged in because of Filter)
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		String content = req.getParameter("content");
		try (Connection conn = DBConnection.getConnection()) {
			PreparedStatement ps = conn.prepareStatement("INSERT INTO confessions (content) VALUES (?)");
			ps.setString(1, content);
			ps.executeUpdate();
			resp.getWriter().write("{\"status\": \"Confession posted anonymously!\"}");
		} catch (SQLException e) { resp.setStatus(500); }
	}

	// GET /public/view (Available to everyone)
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		// Logic to select all from confessions table and return as JSON string
	}
}