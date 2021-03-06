# FloodWatch

FloodWatch (TexasWaterWatch) is a web app made to monitor water levels in flood prone Texas cities such as Houston, San Antonio and Austin.

# Why Was This Built?

Floods regularly wreak havoc on cities located near the Gulf Coast. This was built to help people living in flood prone areas monitor water levels in their cities.

#How Does This Work?

TexasWaterWatch is powered by data from USGS water sensors and Google Maps.

Data is retrieved using the USGS API and represented using Google Maps and a basic HTML Table.

The UI is intentionally pretty sparse. The idea behind the design was to present as little non-critical information as possible.
Symbology and color-coding are heavily used to make the data easy to understand

#Major Files

* src/script contains the main js. files.
--* city.js contains the City class which is used to collect and organize data
--* index.js contains all of the display and UI logic

* public/data.json is used to supply water height averages from USGS sensors.
--* USGS provides a lot of great data, but does not have a consistent way to retrieve relevant site averages.  This file was generated using a python script (located in /pythonscript/script)

* pythonscript/script This was the script used to get the site averages from a list of USGS sampling site names (pythonscript/SiteList.csv)
