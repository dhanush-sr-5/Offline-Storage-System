
==================================================
          OFFLINE STORAGE SYSTEM
             DEPLOYMENT GUIDE
==================================================

1. SYSTEM REQUIREMENTS
----------------------
- Windows 10/11 or compatible Windows Server
- Node.js (compatible version)
- MongoDB Community Server
- Modern web browser
- Minimum 4 GB RAM recommended

2. INSTALLATION
---------------
1. Extract the deployment ZIP.
2. Install Node.js.
3. Install MongoDB Community Server.
4. Ensure the MongoDB Windows service is running.
5. Keep the application folder structure unchanged.

3. START APPLICATION
--------------------
Open the scripts folder.

Double-click start.bat.

Alternatively, open Command Prompt and run:
scripts\start.bat

4. ACCESS DASHBOARD
-------------------
On the same computer:
http://localhost:5000

For other computers on the office network:
http://SERVER-IP:5000

5. HEALTH CHECK
---------------
Run:
scripts\health-check.bat

6. STOP APPLICATION
-------------------
Press CTRL + C in the terminal running the backend.

MongoDB can remain running.

7. DATABASE
-----------
Database name: offline_storage
Collection: processing_records

A fresh database will be created automatically
when the first record is saved.

8. STORAGE
----------
Uploaded documents:
application\backend\uploads\documents

Uploaded audio:
application\backend\uploads\audio

Generated outputs:
application\backend\outputs

Logs:
application\backend\logs

9. IMPORTANT
-------------
- Do not delete the MongoDB database folder.
- Do not expose this application to the public internet.
- Restrict network access to authorized office users.
- Back up MongoDB and uploaded files regularly.

==================================================
             END OF DOCUMENT
==================================================
