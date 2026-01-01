package com.example.confessionsapp.util;
import java.sql.*;

public class DBConnection {
    public static Connection getConnection() throws SQLException {
        // Use the driver and URL matching your MySQL setup
        String url = "jdbc:mysql://localhost:3306/confession_db";
        String user = "root";
        String pass = "yourpassword"; // Change this!
        return DriverManager.getConnection(url, user, pass);
    }
}