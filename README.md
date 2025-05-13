# AWS Workshop :Building near real-time LLM-powered features for monolithic applications

https://catalog.workshops.aws/build-real-time-features-legacy-apps/en-US

The Application
The NEW Science! is a micro blogging web-based application for science related news articles. The application is simple however the concepts you will learn can be applied to more complex or commercial off-the-shelf (COTS) applications for which you may not be able to directly modify the behavior of. 

High-level architecture diagram for the sample application using as starting point of the workshop

 * Amazon API Gateway  is acting as a Reverse Proxy for the application backend
 * Python based backend application running as a Linux Container in Amazon Elastic Container Service (ECS)  (our "black box")
 * React based frontend application being served by Amazon Simple Storage Service (S3)  and Amazon CloudFront 
 * Amazon Elastic Load Balancing (ELB)  is used to integrate Amazon API Gateway  with the backend application running on Amazon Elastic Container Service
 * MySQL based relational database hosting the persistent data (articles and application data) hosted on Amazon Aurora Serverless v2 