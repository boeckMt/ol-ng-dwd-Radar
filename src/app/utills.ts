import { DateTime, Duration } from 'luxon';

export function enumerateDaysBetweenDates(startDate: string, endDate: string, duaration: string) {
  // console.log('dates: ', startDate, endDate);
  const dates = [];

  const currDate = DateTime.fromISO(startDate).toUTC();
  const lastDate = DateTime.fromISO(endDate).toUTC();
  const period = Duration.fromISO(duaration);

  const _formatedDate = currDate.toISO(); // .toFormat('yyyy-MM-dd HH:mm:ss.SSS').replace(' ', 'T') + 'Z';
  dates.push(_formatedDate);

  let nextDate = currDate.plus(period);
  while (nextDate.diff(lastDate).milliseconds <= 0) {
    const formated = nextDate.toISO(); // .toFormat('yyyy-MM-dd HH:mm:ss.SSS').replace(' ', 'T') + 'Z';
    dates.push(formated);
    nextDate = nextDate.plus(period);
  }
  // console.log('dates', dates);
  return dates;
}


export function getDatesBetween(dates: string[], startDate?: string, endDate?: string) {
  if (startDate && !endDate) {
    const startValue = DateTime.fromISO(startDate).toUTC().valueOf();
    return dates.filter(d => {
      const dateValue = DateTime.fromISO(d).toUTC().valueOf();
      if (dateValue >= startValue) {
        return true;
      } else {
        return false;
      }
    });

  } else if (endDate && !startDate) {
    const endVelue = DateTime.fromISO(endDate).toUTC().valueOf();
    return dates.filter(d => {
      const dateValue = DateTime.fromISO(d).toUTC().valueOf();
      if (dateValue <= endVelue) {
        return true;
      } else {
        return false;
      }
    });

  } else if (startDate && endDate) {
    const startValue = DateTime.fromISO(startDate).toUTC().valueOf();
    const endVelue = DateTime.fromISO(endDate).toUTC().valueOf();

    return dates.filter(d => {
      const dateValue = DateTime.fromISO(d).toUTC().valueOf();
      if (dateValue >= startValue && dateValue <= endVelue) {
        return true;
      } else {
        return false;
      }
    });
  }
}

export function addDays(currentTime: string, days: number, action: '-' | '+' = '+') {
  if (action === '+') {
    return DateTime.fromISO(currentTime).toUTC().plus({ days }).toString();
  } else {
    return DateTime.fromISO(currentTime).toUTC().minus({ days }).toString();
  }
}

export function addHours(currentTime: string, hours: number, action: '-' | '+' = '+') {
  if (action === '+') {
    return DateTime.fromISO(currentTime).toUTC().plus({ hours }).toString();
  } else {
    return DateTime.fromISO(currentTime).toUTC().minus({ hours }).toString();
  }
}

export function addMinutes(currentTime: string, minutes: number, action: '-' | '+' = '+') {
  if (action === '+') {
    return DateTime.fromISO(currentTime).toUTC().plus({ minutes }).toString();
  } else {
    return DateTime.fromISO(currentTime).toUTC().minus({ minutes }).toString();
  }
}

/**
*
* e.g 37 and then 41
* 3.7 - 4.1
* 3 < 4
*/
export function checkDateNext10Minutes(before: DateTime, after: DateTime) {
  const _before = Math.round(before.minute / 10);
  const _after = Math.round(after.minute / 10);
  if (_before < _after) {
    return true;
  } else {
    return false;
  }
}

export function checkIf5MinutesLater(cpasLoadTime: DateTime) {
  if (!cpasLoadTime) {
    return true;
  } else {
    const currentTime = DateTime.local();
    // console.log(cpasLoadTime.diff(currentTime, 'minutes').minutes)
    // TODO if lode at 37 min then if after 40 it should also load new!
    const is5 = (currentTime.minute % 5 === 0 && cpasLoadTime.minute !== currentTime.minute) ? true : false;
    if (Math.abs(cpasLoadTime.diff(currentTime, 'minutes').minutes) >= 5) {
      return true;
    } else {
      return is5 && checkDateNext10Minutes(cpasLoadTime, currentTime);
    }
  }
}

/**
  * check if rage or values
  */
export function checkDimensionTime(Dimension) {
  // console.log(Dimension);
  if (Dimension.name === 'time') {
    let values = Dimension.values.split(',');
    if (values.length === 1) { // Split fails - is range
      values = Dimension.values.split('/');
      if (values.length === 1) { // Split fails
        console.log('time Fotmate not known!', values);
      } else {
        return generateTimeFromRange(values);
      }
    } else {
      return values;
    }
    // console.log(values);
  } else {
    console.log('no time Dimension!', Dimension.name);
  }
}

export function generateTimeFromRange(values: string[]) {
  const start = values[0], end = values[1], duaration = values[2];
  let _values = [];
  _values = enumerateDaysBetweenDates(start, end, duaration);
  return _values;
}

/**
 * Find Closest Date to now
 * @param strDates - ISO date Strings
 */
export function findClosestDate(strDates: string[], isUTC = false) {
  let testDate = DateTime.utc();
  if (!isUTC) {
    testDate = DateTime.local();
  }

  const dates = strDates.map((date) => DateTime.fromISO(date));
  const before = [];
  const after = [];
  const max = dates.length;

  for (let i = 0; i < max; i++) {
    const tar = dates[i];
    const diff = (testDate.toMillis() - tar.toMillis());
    if (diff > 0) {
      before.push({ diff, index: i });
    } else {
      after.push({ diff, index: i });
    }
  }

  before.sort((a, b) => {
    if (a.diff < b.diff) {
      return -1;
    }
    if (a.diff > b.diff) {
      return 1;
    }
    return 0;
  });

  after.sort((a, b) => {
    if (a.diff > b.diff) {
      return -1;
    }
    if (a.diff < b.diff) {
      return 1;
    }
    return 0;
  });

  // return { dateBefore: _dates[before[0].index], testDate: testDate.toISOString(), dateAfter: _dates[after[0].index] };
  if (before[0] && after[0]) {
    return { dateBefore: before[0].index, dateAfter: after[0].index };
  } else {
    return { dateBefore: false, dateAfter: false };
  }

}

/**
 *
 * @param date - ISO Date
 */
export function formatDate(date: string, format: string, toUtc = false) {
  if (!date) {
    return;
  }
  if (toUtc) {
    return DateTime.fromISO(date).toUTC().toFormat(format);
  } else {
    return DateTime.fromISO(date).toLocal().toFormat(format);
  }
}


export function getLocation(url = window.location.href) {
  // check for http(s)
  if (url.indexOf('http') === -1) {
    if (url.charAt(0) !== '/') {
      url = `/${url}`;
    }
    url = new URL(url, window.location.origin).toString();
  }

  let pathname = window.location.pathname;
  let hashPath = '';
  let search = window.location.search;
  let hash = window.location.hash;
  let hashRouting: string | boolean = false;

  const pathHashpathSearchHash = url.substring(window.location.origin.length);
  const pathnameAndHashroute = pathHashpathSearchHash.split('/#/');
  /** HashRouting */
  if (pathnameAndHashroute.length === 2) {
    hashRouting = '/#';
    pathname = pathnameAndHashroute[0];

    const hashpathSearchHash = `/${pathnameAndHashroute[1]}`;
    const hasHash = decodeURIComponent(hashpathSearchHash).split('#');

    if (hasHash[1]) {
      const pathSearch = hasHash[0].split('?');
      search = (pathSearch[1]) ? `?${pathSearch[1]}` : '';
      hashPath = pathSearch[0];
      hash = `#${hasHash[1]}`;
    } else {
      const pathSearch = hashpathSearchHash.split('?');
      search = (pathSearch[1]) ? `?${pathSearch[1]}` : '';
      hashPath = pathSearch[0];
      hash = '';
    }
  }

  return {
    url,
    origin: location.origin,
    pathname,
    hashPath,
    search,
    hash,
    hashRouting
  }
}

/**
 * @param url - ...?key=value&...
 */
export function getSearchParamsFronString(url: string) {
  const hasSearch = url.split('?');
  let query = new URLSearchParams();
  if (hasSearch[1]) {
    query = new URLSearchParams(hasSearch[1]);
  }
  return query;
}
