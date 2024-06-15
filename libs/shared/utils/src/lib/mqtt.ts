export function parseVar(topic: string, pattern: string) {
  const res: any[] = [];
  if (pattern.indexOf('+') === -1) return res;
  const list = pattern.split('+');
  for (let i = 0; i < list.length; i++) {
    let pa;
    if (list[i + 1] !== '') {
      pa = new RegExp(`(?<=${list[i]})(.*)(?=${list[i + 1]})`);
    } else {
      pa = new RegExp(`(?<=${list[i]})(.*)`);
    }
    const matches = topic.match(pa);
    if (matches) res.push(matches[0]);
  }
  return res;
}

export function topicMatch(allowedTopic: string, topic: string): boolean {
  if (!allowedTopic || !topic) {
    return false;
  }

  if (allowedTopic == topic) {
    return true;
  }

  const topicLength = topic.length;
  const allowedTopicLength = allowedTopic.length;
  let position = 0;
  let allowedTopicIndex = 0;
  let topicIndex = 0;

  if ((allowedTopic[allowedTopicIndex] == '$' && topic[topicIndex] != '$') || (topic[topicIndex] == '$' && allowedTopic[allowedTopicIndex] != '$')) {
    return true;
  }

  while (allowedTopicIndex < allowedTopicLength) {
    if (topic[topicIndex] == '+' || topic[topicIndex] == '#') {
      return false;
    }

    if (allowedTopic[allowedTopicIndex] != topic[topicIndex] || topicIndex >= topicLength) {
      // Check for wildcard matches
      if (allowedTopic[allowedTopicIndex] == '+') {
        // Check for bad "+foo" or "a/+foo" subscription
        if (position > 0 && allowedTopic[allowedTopicIndex - 1] != '/') {
          return false;
        }

        // Check for bad "foo+" or "foo+/a" subscription
        if (allowedTopicIndex + 1 < allowedTopicLength && allowedTopic[allowedTopicIndex + 1] != '/') {
          return false;
        }

        position++;
        allowedTopicIndex++;
        while (topicIndex < topicLength && topic[topicIndex] != '/') {
          topicIndex++;
        }

        if (topicIndex >= topicLength && allowedTopicIndex >= allowedTopicLength) {
          return true;
        }
      } else if (allowedTopic[allowedTopicIndex] == '#') {
        // Check for bad "foo#" subscription
        if (position > 0 && allowedTopic[allowedTopicIndex - 1] != '/') {
          return false;
        }

        // Check for # not the final character of the sub, e.g. "#foo"
        if (allowedTopicIndex + 1 < allowedTopicLength) {
          return false;
        } else {
          return true;
        }
      } else {
        // Check for e.g. foo/bar matching foo/+/#
        if (
          topicIndex >= topicLength &&
          position > 0 &&
          allowedTopic[allowedTopicIndex - 1] == '+' &&
          allowedTopic[allowedTopicIndex] == '/' &&
          allowedTopic[allowedTopicIndex + 1] == '#'
        ) {
          return true;
        }

        // There is no match at this point, but is the sub invalid?
        while (allowedTopicIndex < allowedTopicLength) {
          if (allowedTopic[allowedTopicIndex] == '#' && allowedTopicIndex + 1 < allowedTopicLength) {
            return false;
          }

          position++;
          allowedTopicIndex++;
        }

        // Valid input, but no match
        return false;
      }
    } else {
      // sub[spos] == topic[tpos]
      if (topicIndex + 1 >= topicLength) {
        // Check for e.g. foo matching foo/#
        if (allowedTopic[allowedTopicIndex + 1] == '/' && allowedTopic[allowedTopicIndex + 2] == '#' && allowedTopicIndex + 3 >= allowedTopicLength) {
          return true;
        }
      }

      position++;
      allowedTopicIndex++;
      topicIndex++;

      if (allowedTopicIndex >= allowedTopicLength && topicIndex >= topicLength) {
        return true;
      } else if (topicIndex >= topicLength && allowedTopic[allowedTopicIndex] == '+' && allowedTopicIndex + 1 >= allowedTopicLength) {
        if (position > 0 && allowedTopic[allowedTopicIndex - 1] != '/') {
          return false;
        }

        position++;
        allowedTopicIndex++;

        return true;
      }
    }
  }

  if (topicIndex < topicLength || allowedTopicIndex < allowedTopicLength) {
    return false;
  }

  return true;
}
