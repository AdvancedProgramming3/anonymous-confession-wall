package com.confessionwall.servlets;

import com.confessionwall.dao.AdviceDAO;
import com.confessionwall.model.AdviceModel;
import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@WebServlet("/api/advice")
public class AdviceServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private AdviceDAO adviceDAO;
    private Gson gson;

    @Override
    public void init() {
        adviceDAO = new AdviceDAO();
        gson = new Gson();
    }

    @Override

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String confessionIdParam = request.getParameter("confessionId");
        List<AdviceModel> adviceList;

        if (confessionIdParam != null && !confessionIdParam.isEmpty()) {
            try {
                int confessionId = Integer.parseInt(confessionIdParam);
                adviceList = adviceDAO.getAdviceByConfessionId(confessionId);
            } catch (NumberFormatException e) {
                adviceList = new ArrayList<>();
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            }
        } else {
            adviceList = adviceDAO.getAllAdvice();
        }

        String json = gson.toJson(adviceList);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(json);
    }

    @Override

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        AdviceModel newAdvice = gson.fromJson(requestBody, AdviceModel.class);

        
        if (newAdvice.getContent() == null || newAdvice.getContent().trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Content is required\"}");
            return;
        }

        if (newAdvice.getConfessionId() == 0) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"confessionId is required\"}");
            return;
        }

        if (newAdvice.getUserId() == 0) {
            newAdvice.setUserId(1); 
        }

        adviceDAO.addAdvice(newAdvice);

        response.setStatus(HttpServletResponse.SC_CREATED);
        response.getWriter().write("{\"message\": \"Advice added to confession\"}");
    }
}