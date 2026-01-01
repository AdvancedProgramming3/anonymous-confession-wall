package com.example.confessionsapp.controller;

import com.example.confessionsapp.model.Confession;
import com.example.confessionsapp.repository.ConfessionRepository;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.ServletException;
import java.io.IOException;
import java.util.List;

@WebServlet("/") // This replaces @GetMapping("/")
public class ConfessionServlet extends HttpServlet {

    private ConfessionRepository confessionRepository;

    public void init() {
        // Since @Autowired/Constructor injection is gone,
        // you must manually initialize your repository here.
        // If it's a standard class:
        this.confessionRepository = new ConfessionRepository();
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // 1. Get the data
        List<Confession> confessions = confessionRepository.findAll();

        // 2. This replaces model.addAttribute
        request.setAttribute("allConfessions", confessions);

        // 3. This replaces 'return "index"'
        // It looks for index.jsp in your webapp folder
        request.getRequestDispatcher("/index.jsp").forward(request, response);
    }
}