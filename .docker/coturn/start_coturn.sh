#!/bin/bash
echo "Starting TURN/STUN server"
FILE_CONFIG="/etc/turnserver.conf"
OPTIONS="-c $FILE_CONFIG --user=${USER_NAME}:${USER_PASSWORD}"

add_options () {
  name_env=$1
  value=$2
  name_value=$3

  if [ -n "$name_env" ]; then
    OPTIONS="$OPTIONS ${value}"
    # sed -i "s/^$name_value=.*/$name_value=$value/" "$FILE_CONFIG"
  fi
}

add_options "$LISTENING_PORT" "--listening-port $LISTENING_PORT" "listening-port"
add_options "$TLS_LISTENING_PORT" "--tls-listening-port $TLS_LISTENING_PORT" "tls-listening-port"
add_options "$EXTERNAL_IP" "--external-ip $EXTERNAL_IP" "external-ip"
add_options "$REPLAY_IP" "--relay-ip $REPLAY_IP" "relay-ip"
add_options "$MIN_PORT" "--min-port $MIN_PORT" "min-port"
add_options "$MAX_PORT" "--max-port $MAX_PORT" "max-port"

echo "turnserver $OPTIONS"
eval "turnserver $OPTIONS"

# turnserver --user=$USER_NAME:$USER_PASSWORD --listening-port $LISTENING_PORT --tls-listening-port $TLS_LISTENING_PORT --external-ip $EXTERNAL_IP --relay-ip $REPLAY_IP --min-port $MIN_PORT --max-port $MAX_PORT
