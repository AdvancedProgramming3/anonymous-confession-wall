package com.confessionwall.servlets;

import com.confessionwall.dao.AdviceDAO;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

@WebServlet("/api/advice/likes")
public class AdviceLikeServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private AdviceDAO adviceDAO;

    @Override
    public void init() {
        adviceDAO = new AdviceDAO();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String idParam = request.getParameter("id");
        String action = request.getParameter("action");

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        if (idParam == null || idParam.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Missing id parameter\"}");
            return;
        }

        try {
            int id = Integer.parseInt(idParam);

            if ("unlike".equals(action)) {
                adviceDAO.decrementLikes(id);
                response.getWriter().write("{\"message\": \"Advice like removed\"}");
            } else {
                adviceDAO.incrementLikes(id);
                response.getWriter().write("{\"message\": \"Advice like added\"}");
            }

            response.setStatus(HttpServletResponse.SC_OK);

        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid ID format\"}");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            e.printStackTrace();
        }
    }
}