package com.cloud;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class Status {

	@RequestMapping(value = "/healthz", method = RequestMethod.GET)
	public String Hello() {
		return "Hello 200";
	}

}
