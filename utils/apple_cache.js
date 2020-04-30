/*
Local cache to avoid unnecessary JSON parsing during Apple mobility data retrieval
Status of cache will update every time data is successfully scraped
*/
const logger = require('../utils/logger');

exports.currentStatus = {
	appleData: undefined
};

// Call to retrieve current state of cache
exports.appleData = () => this.currentStatus.nytCounties;

// Retrieves Apple data from Redis and stores it locally when data is updated
exports.updateAppleCache = async () => {
	try {
		const { redis, keys } = require('../routes/instances');
		const parsedAppleData = JSON.parse(await redis.get(keys.apple_all));
		const numericalStats = (element) => (
			{ ...element, driving: parseFloat(element.driving), transit: parseFloat(element.transit), walking: parseFloat(element.walking) }
		);
		this.currentStatus.appleData = parsedAppleData.map(numericalStats);
		logger.info('Apple local cache updated');
	} catch (err) {
		logger.err('Local Apple cache update failed', err);
	}
};

