# **Website Status Page Using Airtable** #

[<img src="https://deploy.stdlib.com/static/images/deploy.svg" width="192">](https://deploy.stdlib.com/)

Using [Standard Library's](https://stdlib.com) task scheduling API alongside Airtable, you can quickly set up and deploy a custom status page to track the performance of your website. Just set up your workflow using [Build](https://build.stdlib.com) on Standard Library, and then click on the Deploy button above, and you will have a real-time status monitoring application like the one pictured below up and running in no time!

![Screenshot](/readme/images/completed.png)

## **Deploying this Application**

First, make sure that you have a Standard Library account, as well as an Airtable account. Once you have those, add [this base](https://airtable.com/addBaseFromShare/shrQLyQ6TOa9txVXT) to Airtable, and populate the URL and Descriptions columns accordingly. It will end up looking something like this:

![Table](/readme/images/sites.png)

Now, **Create a New Project**, and fill out the **Choose Event and APIs** dialogue page to match the following:

![NewProjects](/readme/images/new_project.png)

This will form the bulk of the logic that will be responsible for populating our Airtable Base with information surrounding our site's performance. Click on **Create Workflow** and proceed to **Link Resources**. If this is your first time linking an Airtable account, make sure that you have your Airtable email and API key on hand in order to get up and running.

Once you have linked your Airtable account and selected the Status Page base that we created earlier, you are ready to configure your workflow APIs.

<script src="https://gist.github.com/k-2tha-brimm/33f6047b9b06babd49308a48f1df3102.js"></script>