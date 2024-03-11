package com.codecool.training_portal.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.PropertySource;

@Profile({"dev"})
@Configuration
@PropertySource(value = "file:./.env")
public class DevPropertyConfig {
}
