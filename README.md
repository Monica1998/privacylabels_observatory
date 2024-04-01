# privacy_labels_site
## How to Start the Backend 
1. Change directories until you reach the following directory:
~/Observatory/privacylabels_observatory/privacy_site
2. Run the command "python3 manage.py runserver"
3. It is currently running in localhost:8000. Click on the development server in the terminal.
4. On the localhost:8000 home page, there are a list of possible queries. To test your own, enter the addition into the URL.
4b. If you want to see which urls are up, go to urls.py in /privacy_backend. If you want to create your own view, create the python script and add it to views.py in the same directory as urls.py
## How to Start the Frontend
1. Change directories until you reach the following directory:
~/Observatory/privacylabels_observatory/privacy_site/privacy_frontend
2. Run "npm start". It'll take a second to load, and then it will redirect you to localhost:3000.
3. Most of the website is capable of running without the backend. However, if you want to view specific apps, the table, or certain graphs, the backend must be running in a separate terminal for it to work. 
