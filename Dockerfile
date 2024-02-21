FROM node:20-bookworm
RUN apt-get update
RUN apt-get install -y chromium
RUN apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*
# Set the working directory in the container
WORKDIR /app
# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the entire application to the working directory
COPY . .

# Build the application
#RUN npm run build

# Expose the port on which the application will run (if applicable)
# EXPOSE 3000

# Define the command to run the application
CMD ["npm", "start"]