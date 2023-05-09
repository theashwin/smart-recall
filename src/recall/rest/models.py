import math
import pickle
import json

import faiss

from .embeddings import Embeddings
from sentence_transformers import SentenceTransformer
import os
import markdown
import numpy as np
from numpy.linalg import norm


class Recall:

	def __init__(self):
		"""
		Loads config from config.json
		"""
		with open("config.json", "r") as config:
			j = json.loads(config.read())
			self.path = j["PATH"]
			self.no_of_results = j["MAX_RESULTS"]

	def get_related_notes(self, selection):
		"""
		Main function that view.py calls to serve the REST API request
		"""
		related_notes = self.related_notes(selection)
		return {"notes": related_notes}

	def related_notes(self, tokens):
		"""
		This function loads the model if it already exists else creates a new one then return the most relevant notes
		using the test function.
		"""
		f = self.load_model(self.path)
		return f.test(tokens)

	def load_model(self, path):
		"""
		Loads the saved pickle file if the model was trained before, else returns a new FAISS object.
		Compares the last modified dates from the notes and check if the files were modified between calls, if yes, then
		update the index else use the old one.
		"""
		if os.path.exists(path + '/.faiss'):
			print("RECALL: Loading pickled FAISS model")
			file = open(path + '/.faiss/faiss.pkl', 'rb')
			pkl = pickle.load(file)
			file.close()
		else:
			print("RECALL: Training new FAISS model")
			f = FAISS(self.path)
			f.train()
			return f
		print("RECALL: Checking if FAISS model update is needed")
		f = FAISS(self.path, self.no_of_results)
		if f.last_modified > pkl.last_modified:
			print("RECALL: Re-training the FAISS model")
			f.train()
			return f
		print("RECALL: No re-training required for the FAISS model")
		return pkl


class FAISS:
	def __init__(self, path, num_results):
		with open("config.json", "r") as config:
			j = json.loads(config.read())
			self.threshold = j['THRESHOLD']
			self.num_partitions = 1
			self.num_results = int(num_results)
		self.path = path
		self.index = None


		#self.model = Embeddings()
		self.model = SentenceTransformer('bert-base-nli-mean-tokens')

		# Same indexes
		self.title = []
		self.loc = []
		self.notes = []
		self.embeddings = []
		self.html = []

		self.last_modified = -math.inf

		self.load_notes(path)

	def load_notes(self, path):
		for root, dirs, files in os.walk(path):
			for file in files:
				if file.title().lower().endswith(".md"):
					with open(os.path.join(root, file), "r", encoding="utf8") as auto:
						note = auto.read()
						if note and not note == "":
							self.html.append(markdown.markdown(note))
							self.notes.append(note)
							self.title.append(file.title().split(".")[0])
							self.loc.append(auto.name)

							lm = os.path.getmtime(os.path.join(root, file))
							if self.last_modified < lm:
								self.last_modified = lm

	def train(self):
		#self.embeddings = self.model.create_embeddings(self.notes)
		self.embeddings = self.model.encode(self.notes)
		quantizer = faiss.IndexFlatL2(self.embeddings.shape[1])
		self.index = faiss.IndexIVFFlat(quantizer, self.embeddings.shape[1], self.num_partitions)

		self.index.train(self.embeddings)
		self.index.add(self.embeddings)

		# Pickle
		if not os.path.exists(self.path + '/.faiss'):
			os.mkdir(self.path + '/.faiss')
		f = open(self.path + '/.faiss/faiss.pkl', 'wb')
		pickle.dump(self, f)
		f.close()

	def test(self, query):
		#q = self.model.create_embeddings([query])
		q = self.model.encode([query])
		distance, indexes = self.index.search(q, self.num_results)
		sim = [np.round(np.dot(np.array(q), np.array(self.embeddings[x])) / (
				np.linalg.norm(q) * np.linalg.norm(self.embeddings[x])), 2) for x in indexes[0]]

		return [[self.title[val], self.html[val], str(sim[i][0])] for i, val in enumerate(indexes[0]) if
		        sim[i][0] >= self.threshold]

	def test2(self, query, results):
		self.num_results = int(results)
		q = self.model.encode([query])
		distance, indexes = self.index.search(q, self.num_results)
		sim = [np.round(np.dot(np.array(q), np.array(self.embeddings[x])) / (
				np.linalg.norm(q) * np.linalg.norm(self.embeddings[x])), 2) for x in indexes[0]]

		return [{
			"title": self.title[val],
			"note": self.html[val],
			"similarity": str(sim[i][0]),
			"embedding": self.embeddings[val]} for i, val in enumerate(indexes[0]) if
			sim[i][0] >= self.threshold
		]


class Graph:

	def __init__(self, results):
		self.results = results
		print("results", self.results)
		with open("config.json", "r") as config:
			j = json.loads(config.read())
			self.path = j["PATH"]

	def cosine(self, A, B):
		return np.dot(A, B) / (norm(A) * norm(B))

	def load_model(self, path):
		"""
		Loads the saved pickle file if the model was trained before, else returns a new FAISS object.
		Compares the last modified dates from the notes and check if the files were modified between calls, if yes, then
		update the index else use the old one.
		"""
		if os.path.exists(path + '/.faiss'):
			print("RECALL: Loading pickled FAISS model")
			file = open(path + '/.faiss/faiss.pkl', 'rb')
			pkl = pickle.load(file)
			file.close()
		else:
			print("RECALL: Training new FAISS model")
			f = FAISS(self.path, self.results)
			f.train()
			return f
		print("RECALL: Checking if FAISS model update is needed")
		f = FAISS(self.path, self.results)
		if f.last_modified > pkl.last_modified:
			print("RECALL: Re-training the FAISS model")
			f.train()
			return f
		print("RECALL: No re-training required for the FAISS model")
		return pkl

	def related_notes(self, tokens, results):
		"""
		This function loads the model if it already exists else creates a new one then return the most relevant notes
		using the test function.
		"""
		f = self.load_model(self.path)
		return f.test2(tokens, results)

	def get_links(self, nodes):
		links = []
		for i in range(len(nodes)):
			for j in range(len(nodes)):
				if i != j:
					link = {}
					link["source"] = str(i+1)
					link["target"] = str(j+1)
					cos = self.cosine(nodes[i]["embedding"], nodes[j]["embedding"])
					link["distance"] = cos * 25
					if cos >= 0.75:
						links.append(link)
		return links

	def get_graph(self, title, desc, selection, results):
		nodes = self.related_notes(f"{selection} {title} {desc}", results)
		print("Notes", len(nodes))

		for i in range(len(nodes)):
			nodes[i]["id"] = str(i+1)

		links = self.get_links(nodes)

		for i in range(len(nodes)):
			del nodes[i]["embedding"]

		return {
			"title": title,
			"desc": desc,
			"selection": selection,
			"results": self.results,
			"nodes": json.dumps(nodes),
			"links": json.dumps(links)
		}
