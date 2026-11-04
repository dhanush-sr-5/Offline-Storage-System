# Offline Storage System — Office Infrastructure Questionnaire

**Purpose:** Collect the information needed to deploy the Offline Storage System on an office server and integrate the document-processing and audio-transcription applications.

**Target:** Fully offline operation inside the office LAN. No internet connection is required during normal operation.

Please fill in what you know. Write **Not confirmed yet** for anything that still needs an answer. Do not include passwords, API keys, or other secrets in this document.

---

## 1. Server and hardware

| Question | Answer |
|---|---|
| Will a dedicated physical server be provided? | |
| If not, which existing computer/server will host the system? | |
| Server manufacturer and model | |
| CPU / processor | |
| RAM capacity | |
| Available disk capacity | |
| Is separate storage available for backups? | |
| Who will administer the server? | |

## 2. Operating system and access

| Question | Answer |
|---|---|
| Server operating system and version (Windows Server / Linux distribution) | |
| Do we have administrator access for installation and configuration? | |
| Can the application run continuously as a Windows service or Linux service? | |
| Are there organizational restrictions on installing software? | |

## 3. Office network / LAN

| Question | Answer |
|---|---|
| Will the storage server be connected to the office LAN? | |
| Can the processing applications reach the storage server over the LAN? | |
| Can office users open the dashboard from their computers? | |
| Can IT assign a static internal IP address or a reserved DHCP address? | |
| What subnet/CIDR should the server use? (Example: `192.168.1.0/24`) | |
| Which internal ports can IT allow for the dashboard and API? | |
| Are there firewall, VLAN, proxy, or network-isolation restrictions? | |
| Is internal DNS/hostname available for the server? | |

**Security note:** Share only non-secret network details needed for deployment. Do not record passwords or credentials here.

## 4. Software and installation permissions

| Question | Answer |
|---|---|
| Is Node.js permitted on the server? | |
| Is MongoDB Community Server permitted on the server? | |
| Is a local web server / reverse proxy permitted if needed? | |
| Can the required installers and dependencies be transferred to the server using approved offline media? | |
| Is antivirus / endpoint protection likely to block the services or local upload folder? | |
| Are there approved software versions or installation procedures we must follow? | |

## 5. Users and expected workload

| Question | Answer |
|---|---|
| How many people will use the dashboard? | |
| How many document jobs are expected per day? | |
| How many audio jobs are expected per day? | |
| Typical and maximum document/image file size | |
| Typical and maximum audio file size | |
| How long must original files and processed outputs be retained? | |
| Is there a data deletion or archival policy? | |
| Is user login / role-based access required? | |

## 6. Backup and recovery

| Question | Answer |
|---|---|
| Is a backup location or backup server available? | |
| How often should MongoDB and uploaded files be backed up? | |
| Who is responsible for checking backups? | |
| Is a recovery-time or recovery-point target defined? | |
| Are there restrictions on removable backup drives? | |

## 7. Document-processing application team

| Question | Answer |
|---|---|
| Programming language and framework used | |
| Can the app call an internal REST API automatically after processing succeeds? | |
| Can it send the original input file and final processed output to the storage API? | |
| What output formats are produced (JSON, TXT, HTML, CSV, other)? | |
| Is the output a JSON object, JSON array, text, file, or a combination? | |
| Can the team provide a sample input and sample final output? | |
| Can the app retry if the storage API is temporarily unavailable? | |
| Can the team share the app's expected deployment/network location? | |

## 8. Audio-transcription application team

| Question | Answer |
|---|---|
| Programming language and framework used | |
| Can the app call an internal REST API automatically after transcription succeeds? | |
| Can it send the original audio file and the final transcript to the storage API? | |
| What transcript format is produced (plain text, JSON, subtitle file, other)? | |
| Can the team provide a sample audio file and sample transcript/output? | |
| Can the app retry if the storage API is temporarily unavailable? | |
| Can the team share the app's expected deployment/network location? | |

## 9. Integration agreement

Confirm with both application teams:

- [ ] The storage API will be called automatically only after processing succeeds.
- [ ] The original input and final output will be sent together in one request.
- [ ] The storage system will generate its own unique processing ID.
- [ ] The application team will provide sample requests and responses.
- [ ] The application team will agree on how to handle timeouts and retries.
- [ ] The application team will not require internet access to reach the storage server.

## 10. Final deployment decisions

| Decision | Confirmed value |
|---|---|
| Storage server host | |
| Operating system | |
| Static internal IP / hostname | |
| Dashboard URL for office users | |
| API base URL for processing applications | |
| Approved API/dashboard ports | |
| MongoDB data location | |
| Original-file storage location | |
| Backup location and schedule | |
| Expected go-live date | |

---

## Quick summary to bring back

The most important answers to confirm first are:

1. Dedicated server or existing computer, plus its specifications.
2. Server operating system and administrator installation permissions.
3. Static internal IP and whether office LAN clients can reach it.
4. Which ports IT can allow internally.
5. Whether Node.js and MongoDB are approved.
6. Document and audio app languages/frameworks.
7. Whether both apps can automatically send the original file and final output to an internal REST API.
8. Expected users, processing volume, file sizes, retention, and backup requirements.

**Reminder:** This system is intended to operate fully offline on the office network. No public internet access is required for normal operation.
