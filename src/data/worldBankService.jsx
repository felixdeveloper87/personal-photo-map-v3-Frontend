export const fetchWorldBankIndicators = async (isoCode) => {
    const indicators = {
        gdp: "NY.GDP.MKTP.CD",
        lifeExpectancy: "SP.DYN.LE00.IN",
        gniPerCapita: "NY.GNP.PCAP.CD",
        gdpGrowth: "NY.GDP.MKTP.KD.ZG",
        internetUsers: "IT.NET.USER.ZS",
        urbanPopulation: "SP.URB.TOTL.IN.ZS",
        unemployment: "SL.UEM.TOTL.ZS",
        gniPerCapitaPPP: "NY.GNP.PCAP.PP.CD", // usado como proxy para IDH
    };

    const fetchIndicator = async (code) => {
        const url = `https://api.worldbank.org/v2/country/${isoCode}/indicator/${code}?format=json&per_page=10`;
        const response = await fetch(url);
        if (!response.ok) return null;

        const data = await response.json();
        const validEntry = data[1]?.find(entry => entry.value !== null);
        return validEntry || null;
    };

    const results = await Promise.all(
        Object.entries(indicators).map(async ([key, code]) => {
            const entry = await fetchIndicator(code);
            return [key, entry];
        })
    );

    const formatters = {
        currencyUSD: (val) => formatGDP(val),
        percent: (val) => `${val.toFixed(1)}%`,
        years: (val) => `${val.toFixed(1)} years`,
    };

    const formatted = {};

    for (const [key, entry] of results) {
        if (!entry) continue;

        const val = entry.value;
        const year = entry.date;

        switch (key) {
            case 'gdp':
                formatted.gdp = {
                    value: formatters.currencyUSD(val, true),
                    raw: val,
                    year,
                };
                break;
            case 'lifeExpectancy':
                formatted.lifeExpectancy = { value: formatters.years(val), year };
                break;
            case 'gniPerCapita':
                formatted.gniPerCapita = { value: formatters.currencyUSD(val), year };
                break;
            case 'gniPerCapitaPPP':
                formatted.hdiProxy = { value: formatters.currencyUSD(val), year };
                break;
            case 'gdpGrowth':
            case 'internetUsers':
            case 'urbanPopulation':
            case 'unemployment':
                formatted[key] = { value: formatters.percent(val), year };
                break;
            default:
                break;
        }
    }

    return formatted;
};


const formatGDP = (value) => {
    if (value >= 1_000_000_000_000) {
        return `$${(value / 1_000_000_000_000).toFixed(2)} Trillion`;
    }
    if (value >= 1_000_000_000) {
        return `$${(value / 1_000_000_000).toFixed(2)} Billion`;
    }
    if (value >= 1_000_000) {
        return `$${(value / 1_000_000).toFixed(2)} Million`;
    }
    return `$${value.toLocaleString('en-US')}`;
};

