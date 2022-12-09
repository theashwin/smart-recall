# Intelligent Notes Recall using Browser Extension

Please check [PROPOSAL.md](PROPOSAL.md) for Project Proposal

Please check [PROGRESS REPORT.md](PROGRESS REPORT.md) for Progress Report

# Installation
## Django Backend
You'll need Anaconda / Miniconda installed on the system to install all the python dependencies that are needed to use this project. If you do not have Anaconda installed you can install it from the below link. 
 
[Install Anaconda](https://www.anaconda.com/), if not already installed

**Create a new environment using Anaconda Prompt to avoid conflicting packages from in the current environment**
```
conda create -n django python=3.10
```

```
conda activate django
```

Change directory to `/downloaded_path/src/recall`. This is where we can run the Django backend. 

Install all the requirements for the project using the following command,

```
pip install -r requirements.txt
```

Ideally, all of the requirements would be installed using this command, if not please install the required package manually

Now, run the Django backend using the following command
```
python manage.py runserver
```

Keep this server running, we'll now install the browser extension to use the application intuitively.

## Firefox Extension
- Go to the URL,
```
about:debugging#/runtime/this-firefox
```

- **Click on Load Temporary Add-On**
- Select `manifest.json` at `firefox/manifest.json`
- You've successfully installed the Firefox extension

# Usage
- Once the Django backend is up and running and the Firefox extension is installed 
- You can triple click on any paragraph that automatically selects the whole paragraphs and makes a search to the backend
- The backend will return most relevant notes if one exists else will return empty list.
  - The similarity is determined by the threshold which is saved in `config.json`. 
  - The lower the threshold lower the relevance of the notes.

## Examples
> In statistics, naive Bayes classifiers are a family of simple "probabilistic classifiers" based on applying Bayes' theorem with strong independence assumptions between the features. They are among the simplest Bayesian network models, but coupled with kernel density estimation, they can achieve high accuracy levels.

> k-means clustering is a method of vector quantization, originally from signal processing, that aims to partition n observations into k clusters in which each observation belongs to the cluster with the nearest mean (cluster centers or cluster centroid), serving as a prototype of the cluster. 


# Screenshots
Screenshots for the above examples,

<p>
<img alt="Example #1: Result No. 1" title="Example #1: Result No. 1" src="docs/img/example-1-1.jpg" width="32.5%">
<img alt="Example #1: Result No. 2" title="Example #1: Result No. 2" src="docs/img/example-1-2.jpg" width="32.5%">
<img alt="Example #1: Result No. 3" title="Example #1: Result No. 3" src="docs/img/example-1-3.jpg" width="32.5%">
<center>Example #1: Top Three Results</center>
</p>

<p>
<img alt="Example #2: Result No. 1" title="Example #2: Result No. 1" src="docs/img/example-2-1.jpg" width="32.5%">
<img alt="Example #2: Result No. 2" title="Example #2: Result No. 2" src="docs/img/example-2-2.jpg" width="32.5%">
<br>
<img alt="Example #2: Result No. 3" title="Example #2: Result No. 3" src="docs/img/example-2-1.jpg" width="32.5%">
<img alt="Example #2: Result No. 4" title="Example #2: Result No. 4" src="docs/img/example-2-2.jpg" width="32.5%">
<center>Example #2: Top Four Results</center>
</p>

# Proposal
Intelligent Notes Recall using Browser Extension, as time passes the percent of information retained from any notes or resource exponentially decreases, so as to combat the forgetting curve frequent recall / revision is utmost important. It uses three main topics taught during the class: **Language Models, Relevant Search and Relevance Feedback.**

## Idea
The idea is to have an intelligent browser extension that reads the current browsing page dynamically and suggests the most related notes from your note-taking application databases. For instance, suppose you're reading an article on "Transformer Neural Networks" then the browser extension will dynamically read the webpage and show the most relevant notes to improve recall from the already saved notes.

## Motivation
I personally take a lot of notes, but the taking notes is not enough, we should be able to re-read the notes once in a while to improve memorization or understanding of the notes. Without which the importance of taking notes drastically decreases. 

This is the main problem that students face when the notes are not reviewed frequently and in an intuitive manner. The Information Retained decreases as the time elapses.
![The Forgetting Curve](docs/img/forgetting-curve.webp)
<p style="text-align:center">
Fig.1 - The Forgetting Curve
</p>

To combat this phenomenon the main solution is to keep reviewing the notes frequently so that the % of information retained is maximized.
![Combating Forgetting Curve](docs/img/combating-forgetting-curve.jpg)
<p style="text-align:center">
Fig.2 - Combating Forgetting Curve using Intelligent Recall
</p>

**This extension will help with information retention as well as intuitive note-taking.**

## References
[Combattign the Forgetting Curve](https://www.mindtools.com/pages/article/forgetting-curve.htm)

# Time Report
## Team Members
Ashwin Patil `anpatil2@illinois.edu` `SOLO PROJECT`

## Firefox Extension [14 Hours]
- [x] `2 Hours` Learning extension development
- [x] `7 Hours` Developing extension backend
- [x] `3 Hours` Extension frontend design
- [x] `2 Hours` Connecting extension with django backend using REST APIs

## Django Backend [18 Hours]
- [x] `2 Hours` Developing microservice architecture for backend
- [x] `2 Hours` Exposing REST APIs for extension use, serialization to transfer data.
- [x] `2 Hours` Creating embeddings from Notes using BERT Base
- [x] `4 Hours` Facebook AI Similarity Search (FAISS) for efficient similarity search.
  - [x] `2 Hours` Learning FAISS
  - [x] `2 Hours` Implementing FAISS and exploring hyperparameters.
- [x] `1 Hour` Converting Markdown to HTML for displaying on frontend

## Miscellaneous [4 Hours]
- [x] `2 Hours` Documentation
- [x] `2 Hours` Presentation
