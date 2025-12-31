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
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String requestBody = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
		
		ConfessionModel newConfession = gson.fromJson(requestBody, ConfessionModel.class);
		if(newConfession.getUserId() == 0) {
			newConfession.setUserId(1);
		}
		
		confessionDAO.addConfession(newConfession);
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.setStatus(HttpServletResponse.SC_CREATED); 
		
		response.getWriter().write("{\"message\": \"Confession created successfully\"}");
		
	}

}
