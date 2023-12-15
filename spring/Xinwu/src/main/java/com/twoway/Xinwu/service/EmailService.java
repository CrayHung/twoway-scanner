package com.twoway.Xinwu.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.mail.MailProperties;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.twoway.Xinwu.entity.RefreshToken;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private MailProperties mailProperties;

    /******傳送一組字串到email ********/
    public void sendEmail(String to , String body , String subject )throws MessagingException{

        String emailContent = " <a href='" + body + "'>點擊重置密碼</a> ";

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setSubject(subject);
        helper.setFrom(mailProperties.getUsername());
        helper.setText(emailContent,true);
        // helper.setText(body);
        helper.setTo(to);

        mailSender.send(mimeMessage);
        System.out.println("mail send");

    }
    /******傳送一組字串到email ********/

        /******傳送多組字串到email ********/
        // public void sendEmail(String to  ,RefreshToken token, String subject )throws MessagingException{
        //     MimeMessage mimeMessage = mailSender.createMimeMessage();
        //     MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
    
        //     helper.setSubject(subject);
        //     helper.setFrom(mailProperties.getUsername());

        //     String[] urls = generateResetPasswordUrl(token);
        //     String body = String.join("\n", urls);
        
        //     helper.setText(body);
        //     helper.setTo(to);
    
        //     mailSender.send(mimeMessage);
        //     System.out.println("mail send");
    
        // }

        // private String[] generateResetPasswordUrl(RefreshToken token) {
        //     String[] urls = new String[3];
        //     urls[0] = "http://localhost:8080/lpr/all";
        //     urls[1] = "http://localhost:8080/lpr/cams/latest";
        //     urls[2] = "http://localhost:8080/reset/reset-password?token=" + token;
        //     return urls;
        // }
        /******傳送多組字串到email ********/
   
}
