FROM ubuntu:22.04

RUN apt-get update \
  && apt-get install -y coturn vim curl ca-certificates libpsl5 openssl publicsuffix \
  && apt-get clean
# RUN apt install iputils-ping telnet

RUN rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# ENV TURN_SECRET 99df25794bf9ccb
ENV USER_NAME=vmshcm_coturn
ENV USER_PASSWORD=123456789

RUN mkdir -p /etc/ssl/coturn/
COPY ./ssl/ /etc/ssl/coturn/
COPY ./turnserver.conf /etc/turnserver.conf

ADD start_coturn.sh start_coturn.sh
RUN chmod +x start_coturn.sh

CMD ["./start_coturn.sh"]

#CMD ["turnserver","-c", "/etc/turnserver.conf" ,"--user=${TURN_USER_NAME}:${TURN_USER_PASSWORD}"]
