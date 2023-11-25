FROM pudding/docker-app:node-18-7z-20230521

RUN apt-get update --fix-missing

RUN apt-get install -y \
    poppler-utils

RUN apt-get install -y \
    unzip unoconv zip

# COPY package.json /
# RUN npm install

#CMD ["bash"]