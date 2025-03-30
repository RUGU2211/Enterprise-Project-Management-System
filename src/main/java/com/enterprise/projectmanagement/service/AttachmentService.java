package com.enterprise.projectmanagement.service;

import com.enterprise.projectmanagement.model.Attachment;
import com.enterprise.projectmanagement.model.Issue;
import com.enterprise.projectmanagement.repository.AttachmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.transaction.Transactional;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class AttachmentService {
    private final AttachmentRepository attachmentRepository;
    private final Path fileStorageLocation;

    @Autowired
    public AttachmentService(AttachmentRepository attachmentRepository) {
        this.attachmentRepository = attachmentRepository;
        this.fileStorageLocation = Paths.get("./uploads").toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public List getAllAttachments() {
        return attachmentRepository.findAll();
    }

    public Optional getAttachmentById(Long id) {
        return attachmentRepository.findById(id);
    }

    public List getAttachmentsByIssue(Issue issue) {
        return attachmentRepository.findByIssue(issue);
    }

    @Transactional
    public Attachment storeAttachment(MultipartFile file, Issue issue, com.enterprise.projectmanagement.model.User uploadedBy) throws IOException {
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename = UUID.randomUUID().toString() + fileExtension;

        // Store file
        Path targetLocation = this.fileStorageLocation.resolve(uniqueFilename);
        Files.copy(file.getInputStream(), targetLocation);

        // Create attachment record
        Attachment attachment = new Attachment();
        attachment.setFileName(originalFilename);
        attachment.setFilePath(targetLocation.toString());
        attachment.setFileType(file.getContentType());
        attachment.setIssue(issue);
        attachment.setUploadedBy(uploadedBy);

        return attachmentRepository.save(attachment);
    }

    @Transactional
    public void deleteAttachment(Long id) throws IOException {
        Attachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + id));

        // Delete file
        Path filePath = Paths.get(attachment.getFilePath());
        Files.deleteIfExists(filePath);

        // Delete record
        attachmentRepository.deleteById(id);
    }
}