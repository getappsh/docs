# Stage 1: Base image.
## Start with a base image containing NodeJS so we can build Docusaurus.
FROM node:lts AS base
## Disable colour output from yarn to make logs easier to read.
ENV FORCE_COLOR=0
## Enable corepack.
RUN corepack enable
## Set the working directory to `/opt/docusaurus`.
WORKDIR /opt/docusaurus

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . /opt/docusaurus/

RUN yarn docusaurus clean-api-docs all
RUN yarn docusaurus gen-api-docs agent

RUN yarn docusaurus clear-env-docs
RUN yarn docusaurus gen-env-docs

## Build the static site.
RUN yarn build



FROM nginx:stable-alpine as deploy
WORKDIR /opt/docusaurus
# Copy what we've installed/built from production
COPY --from=base /opt/docusaurus/build /usr/share/nginx/html/ 

# docker build -t docs .
# docker run --rm -d -p 3000:80 --name docs-container docs