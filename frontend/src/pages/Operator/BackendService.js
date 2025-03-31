// src/pages/Operator/BackendService.js

const BackendService = {
    issues: [],
    resolvedIssues: [],
    listeners: [],
  
    // Method to raise a new issue
    raiseIssue(issueDetails) {
      const newIssue = {
        ...issueDetails,
        id: Date.now(), // Unique ID based on the current timestamp
        timestamp: new Date().toLocaleString(), // Current timestamp
        status: 'Unacknowledged' // Initial status
      };
      this.issues.push(newIssue); // Add the new issue to the active issues array
      this.notifyListeners(); // Notify all listeners about the new issue
      return newIssue; // Return the newly created issue
    },
  
    // Method to acknowledge an issue
    acknowledgeIssue(issueId) {
      const issue = this.issues.find(i => i.id === issueId); // Find the issue by ID
      if (issue) {
        issue.status = 'Acknowledged'; // Update the status to 'Acknowledged'
        this.notifyListeners(); // Notify all listeners about the status change
      }
    },
  
    // Method to resolve an issue
    resolveIssue(issueId, resolution) {
      const index = this.issues.findIndex(i => i.id === issueId); // Find the index of the issue
      if (index !== -1) {
        const resolvedIssue = this.issues[index]; // Get the issue to be resolved
        resolvedIssue.status = 'Resolved'; // Update the status to 'Resolved'
        resolvedIssue.resolution = resolution; // Add the resolution details
        resolvedIssue.resolvedTimestamp = new Date().toLocaleString(); // Set the resolved timestamp
  
        // Move the resolved issue to the resolved issues array
        this.resolvedIssues.push(resolvedIssue);
  
        // Remove the issue from the active issues array
        this.issues.splice(index, 1);
  
        this.notifyListeners(); // Notify all listeners about the changes
      }
    },
  
    // Method to subscribe to issue updates
    subscribe(listener) {
      this.listeners.push(listener); // Add the listener to the listeners array
      return () => {
        // Return a function to unsubscribe the listener
        this.listeners = this.listeners.filter(l => l !== listener);
      };
    },
  
    // Method to notify all listeners about changes
    notifyListeners() {
      this.listeners.forEach(listener => listener({
        activeIssues: this.issues, // Send the current active issues
        resolvedIssues: this.resolvedIssues // Send the current resolved issues
      }));
    }
  };
  
  export default BackendService; // Export the BackendService object