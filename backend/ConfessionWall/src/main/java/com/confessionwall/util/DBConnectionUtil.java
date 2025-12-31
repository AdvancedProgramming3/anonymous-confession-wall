package com.confessionwall.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnectionUtil {
	private static final String URL = "jdbc:mysql://3XY8g5Th8H384Vg.root:Ju8AjZxSmTKk91fY@gateway01.eu-central-1.prod.aws.tidbcloud.com:4000/confessions_app";
	private static final String PASSWORD = "Ju8AjZxSmTKk91fY";
	private static final String USER = "3XY8g5Th8H384Vg.root";
	
	public static Connection getConnection() {
		Connection connection = null;
		
		try {
			Class.forName("com.mysql.cj.jdbc.Driver");
			
			connection = DriverManager.getConnection(URL, USER, PASSWORD);
		} catch(ClassNotFoundException e) {
			e.printStackTrace();
		} catch(SQLException e) {
			e.printStackTrace();
		}
		
		return connection;
	}

}
