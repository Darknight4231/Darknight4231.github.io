<?xml version="1.0" encoding="UTF-8"?>
<html xsl:version="1.0" xmlns:xsl="http://www.darknight4231.github.io/Sitemap.xml">
<body style="font-family:Arial;font-size:12pt;background-color:#EEEEEE">
<xsl:for-each select="urlset/url">
  <div style="background-color:teal;color:white;padding:4px;float:left;clear:left;display:block;">
    <span style="font-weight:bold;clear:left;"><xsl:value-of select="loc"/> - </span>
  </div>
</xsl:for-each>
</body>
</html>
