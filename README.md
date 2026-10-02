# About
URL Shortener is a website/application that <span class = "concept">converts the lengthy url into a shortened url without changing the IP Address of the url/domain.</span>

> **For Example**
> Original URL : 
> https://preetaroraa/linkedin.com
> 
> Short URL : 
> https://shortbit.ly/ASxSM

## Delivered 
1. Unique hash codes
2. Expirations
3. Custom aliases
4. Collision handling
5. High read volume

# Client - Server Achitecture

## For company around 1,000-10,000 users and high spike.

```mermaid
flowchart LR
A[Client] --> |Http Request| B[Load Balancer] --> C(Server) --> | POST /ShortURL | Q((Queue)) --> D[(Database)]
D[(Database)] --> | Cache | E{Redis}
C(Server) -->|Check| E{Redis}
E{Redis} -.-> |Miss| D[(Database)] 
E{Redis} -.-> |Hit| C(Server)
```


### Software Components
1. User -> create short url, fetch url
2. URL Shortener System -> generates hash code
3. Redis Server -> store cached request for minimising db roundups.
4. Queue -> stores asynchronous request for minimising bottlenecks.

### Creation Designing
```mermaid
---
config:
  sequence:
    mirrorActors: false
---
sequenceDiagram
	participant Client
	participant Server
	participant Queue
	participant Worker
	participant Database
	
	Client ->> Server : Create short url
	Server ->> Queue : Add request 
	Queue ->> Worker : Process
	Worker ->> Database : Stores 
	Database -->> Server : Response back
	Server -->> Client : Response back
	
```


### URL Redirection
```mermaid
---
config:
 sequence:
  mirrorActors: false
---
sequenceDiagram
	participant Client
	participant Server
	participant Redis
	participant Database
	
	Client ->> Server : Redirect/Fetch 
	Server ->> Redis : Check for cache
	
	alt URL exists
		Redis ->> Server : Cache hit
		Server -->> Client : Redirection
	else URL exists but expired
		Server ->> Redis : Remove stale data
		Server ->> Database : Fetch latest 
		Database -->> Server : Response back
		Server ->> Redis : Update cache with ttl
		Server -->> Client : Redirection
	else URL doesn't exist
		Redis ->> Server : Cache HIT	
		Server ->> Database : Fetch original url
		Database -->> Server : Response back
		Server -->> Client : Redirection
	end
	
```

### ER Diagram
```mermaid
erDiagram
	User ||--o{ URL : creates
	User {
		string id PK
		string username UK
		string password
		array url 
	}
	
	URL {
		string id PK
		string original_url
		string short_url UK
		string userId FK
	}
```



