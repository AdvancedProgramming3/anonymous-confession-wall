package com.example.confessionsapp.repository;

import com.example.confessionsapp.model.Advice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdviceRepository extends JpaRepository<Advice, Long> {
}
