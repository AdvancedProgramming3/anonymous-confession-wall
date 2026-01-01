package com.confessionwall.servlets;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import com.confessionwall.dao.ConfessionDAO;
import com.confessionwall.model.ConfessionModel;
import com.google.gson.Gson;


@WebServlet("/api/confessions")
public class ConfessionServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    private ConfessionDAO confessionDAO;
    private Gson gson;
    
    @Override
    public void init() {
    	confessionDAO = new ConfessionDAO();
    	gson = new Gson();
    }
    
    
    @Override
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		List<ConfessionModel> confessions = confessionDAO.getAllConfession();
		String confessionsJson = gson.toJson(confessions);
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		
		response.getWriter().write(confessionsJson);
    }

	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
		response.setContentType("application/json");
		HttpSession session = request.getSession(false);

		// Day 2: Login required check
		if (session == null || session.getAttribute("userId") == null) {
			response.setStatus(401);
			response.getWriter().write("{\"error\": \"You must be logged in to post\"}");
			return;
		}

		int userId = (int) session.getAttribute("userId");
		String content = request.getParameter("content");

		ConfessionModel confession = new ConfessionModel();
		confession.setContent(content);
		confession.setUserId(userId); // Use the ID from the session!

		confessionDAO.addConfession(confession);
		response.getWriter().write("{\"message\": \"Confession added\"}");
	}

}
