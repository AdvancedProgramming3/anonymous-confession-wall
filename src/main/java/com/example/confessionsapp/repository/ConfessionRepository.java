package com.example.confessionsapp.repository;

import com.example.confessionsapp.model.Confession;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ConfessionRepository {

    // Database connection details - update these to match your MySQL setup!
    private String dbUrl = "jdbc:mysql://localhost:3306/confessions_db";
    private String dbUser = "root";
    private String dbPassword = "password";

    public List<Confession> findAll() {
        List<Confession> confessions = new ArrayList<>();
        String query = "SELECT * FROM confessions";

        try {
            // Load the MySQL Driver
            Class.forName("com.mysql.cj.jdbc.Driver");

            try (Connection conn = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
                 Statement stmt = conn.createStatement();
                 ResultSet rs = stmt.executeQuery(query)) {

                while (rs.next()) {
                    Confession c = new Confession();
                    c.setId(rs.getLong("id"));
                    c.setMessage(rs.getString("message"));
                    confessions.add(c);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return confessions;
    }
}