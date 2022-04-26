FROM node:14.18.0-buster-slim

WORKDIR /app

# COPY ./package.json /app/package.json

# RUN npm install --global expo-cli

# RUN npm install

RUN npm install --global serve

COPY ./web-build /app/web-build

# Environment Variables (change these to nicetry)
ENV REACT_APP_PELLEUM_API_BASE_URL=http://localhost:8000
ENV REACT_APP_SEGMENT_WRITE_KEY=oTZCqJQA3K2CVRfHBgghbxBF5b9BU5Oj
ENV REACT_APP_ROBINHOOD_ID=d75e2cf4-a4ee-4869-88c3-14bfadf7c196

# EXPOSE $SERVER_PORT

# CMD ["expo", "web"]
CMD ["serve", "-s", "web-build"]