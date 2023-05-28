import * as dateFNS from "date-fns";

// date-fns v2.29.2
type DurationKey = "years" | "months" | "weeks" | "days" | "hours" | "minutes" | "seconds";

export const getDurationAgo = (ago: Date) => {
	const getFormatDurations = (durationMap: Map<DurationKey, number>) => {
		for (const durationKey of durationMap.keys()) {
			if (durationMap.get(durationKey)) {
				return [durationKey];
			}
		}
		return ["seconds"];
	};

	const now = new Date();
	const intervalDuration = dateFNS.intervalToDuration({
		start: ago,
		end: now,
	});

	const durationMap = new Map();
	durationMap.set("years", intervalDuration.years);
	durationMap.set("months", intervalDuration.months);
	durationMap.set("weeks", intervalDuration.weeks);
	durationMap.set("days", intervalDuration.days);
	durationMap.set("hours", intervalDuration.hours);
	durationMap.set("minutes", intervalDuration.minutes);
	durationMap.set("seconds", intervalDuration.seconds);

	const formattedDuration = dateFNS.formatDuration(intervalDuration, {
		format: getFormatDurations(durationMap),
	});

	return `${formattedDuration} ago`;
};
