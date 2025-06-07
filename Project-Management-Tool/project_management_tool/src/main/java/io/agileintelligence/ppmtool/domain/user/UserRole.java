package io.agileintelligence.ppmtool.domain.user;

/**
 * Enumeration of possible user roles in the system.
 */
public enum UserRole {
    ADMIN("Administrator"),
    DEVELOPER("Developer"),
    TESTER("Tester"),
    USER("Standard User");
    
    private final String displayName;
    
    UserRole(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
} 