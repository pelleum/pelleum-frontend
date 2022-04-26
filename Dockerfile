FROM node 

WORKDIR /app

COPY ./package.json /app/package.json

RUN npm install

COPY . /app

# Environment Variables (change these to nicetry)
ENV PELLEUM_API_BASE_URL=http://192.168.1.64:8000
ENV SEGMENT_WRITE_KEY=oTZCqJQA3K2CVRfHBgghbxBF5b9BU5Oj
ENV ROBINHOOD_ID=d75e2cf4-a4ee-4869-88c3-14bfadf7c196

# EXPOSE $SERVER_PORT

CMD ["expo", "web"]