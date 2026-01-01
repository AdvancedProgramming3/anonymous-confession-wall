package com.example.confessionsapp.model;

public class User {
    private Long id;
    private String username;
    private String password;

    // Default constructor (required)
    public User() {}

    // Constructor with parameters
    public User(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    // Standard Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}