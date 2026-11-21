/**
 * Mike O'Callaghan–Pat Tillman Memorial Bridge (Hoover Dam Bypass, US 93 /
 * I-11), Black Canyon of the Colorado River, 460 m downstream of Hoover Dam.
 *
 * A concrete-steel composite deck arch: twin concrete arch ribs joined by
 * steel struts, a 323 m span springing from the canyon walls, and a steel
 * girder deck carried 270 m over the river on fifteen bents of paired,
 * slender concrete columns: five on the Nevada approach, four on each half of
 * the arch, two on the Arizona approach. The model is the structure only, as
 * the bridge rules have it (docs/reference.md, Bridges): ribs, struts,
 * columns, cap beams, the deck's fascias, parapets and soffit, and the
 * walkway on the upstream side with its surface. Nothing is drawn at road
 * level across the carriageways; the map draws them.
 *
 * Frame: origin at the centroid of the OSM outline (-114.741810, 36.012727),
 * the deck's axis turned to bearing 300.3°, so the model's north (-Z) runs to
 * the Nevada end and +x is upstream (toward the dam, the walkway side).
 * y = 0 is the river under the arch, 196.52 m NAVD88, the lowest ground under
 * the model. Generator coordinates (Part frame): x across, y along toward
 * Nevada, z up.
 *
 * On the canyon's terrain, as hoover-dam.ts is: every column and abutment
 * foot stands on the map's own ground (Mapterhorn z15, the DEM strip below,
 * read with `bun tools/terrain.ts grid -114.741810 36.012727 310 4 --bearing
 * 300.3` on 2026-11-20), 0.2 m under it, split so the foot follows the slope.
 * The arch ribs run into the canyon walls where the DEM rises over them.
 *
 * Roadway heights the deck is built to (lidar, `tools/bridge_ele.py measure
 * 126301445 139159421 --every 40`, westbound carriageway; NAVD88): 464.00 m
 * at the Arizona end, a crest of 466.14 m at 240 m (over the arch crown),
 * 463.22 m at the Nevada end, a smooth vertical curve between (table ROAD).
 * The map's roadway: no `ele`/`height` in OSM, and Barrelman ignores `ele`
 * more than 150 m above the ground, so over the river it is interpolated
 * between the ends and may sit up to ~2.5 m under the true crest. The deck
 * keeps no up-facing surface between road − 3.2 m and the parapet tops, so a
 * low roadway still shows.
 *
 * Sources
 * - OSM: way/1041460706 (man_made=bridge, bridge:structure=arch, wikidata
 *   Q1293993), 26.4 m wide, 587 m long; carriageways way/126301445,
 *   139159421 (westbound, x ≈ +4.4) and 139159420, 38325130 (eastbound,
 *   x ≈ −6); walkway way/82451334 at x ≈ +12.6.
 * - USGS 3DEP lidar AZ_LowerColoradoRiver_B1_2018 (flown after the 2010
 *   opening): roadway heights above, the river at 196.56 m.
 * - Mapterhorn z15 (https://mapterhorn.com/attribution): the canyon walls,
 *   every foot.
 * - Published (Wikipedia "Mike O'Callaghan–Pat Tillman Memorial Bridge";
 *   FHWA/HDR project figures): length 1,900 ft (579 m), arch span 1,060 ft
 *   (323 m), roadway 890–900 ft (270 m) and arch 840 ft (256 m) above the
 *   river, arch rise 277 ft (84.4 m), seven approach column pairs (five
 *   Nevada, two Arizona) and eight piers on the arch, 53 segments per rib,
 *   twin ribs joined by steel struts.
 * - Photos (Wikimedia Commons), each checked against a render from its side:
 *   "Mike O'Callaghan–Pat Tillman Memorial Bridge - Oct 2021.jpg", APK,
 *   CC BY-SA 4.0 (from the dam, upstream side, bearing ~35);
 *   "Mike O'Callaghan–Pat Tillman Memorial Bridge from Hoover Dam.jpg", APK,
 *   CC BY-SA 4.0 (from the dam crest, above);
 *   "Mike O'Callaghan–Pat Tillman Memorial Bridge 09 2017 4768.jpg",
 *   Mariordo (Mario Roberto Durán Ortiz), CC BY-SA 4.0 (aerial from the
 *   south-west, downstream side).
 *
 * Measured: the roadway profile (lidar), the deck's width and the walkway's
 * side (OSM), the canyon (Mapterhorn). Published: span, rise, the crown's
 * height, the bent count. Derived: the bent spacing, 587 m / 16 = 36.7 m
 * (published 120 ft spans), with the crown at the middle of the tenth span
 * from Nevada, which puts the crown 52 m Arizona-side of the outline's centre,
 * over the road's lidar crest and the river; the springings then land 161.5 m
 * either side on the canyon walls at the DEM's 175 m benches. Estimated (from
 * the photos): rib width 6.1 m and centres ±8.5 m, rib depth 5 m at the
 * crown to 10 m at the springing (deepened after the first photo round), the arch's catenary-like curve, columns
 * 3.4 × 4.6 m with a slight taper on the tall approach columns, cap beams
 * 2 m deep, the deck's 3.2 m girder depth, parapets 1.1 m, the strut spacing.
 *
 * Doubts: the struts' real pattern (seen only from below); the columns'
 * vertical recesses are left out; OSM's wikidata is Q1293993 (the brief's
 * Q1129452 is a video game). Not lit at night beyond the map's own roadway
 * lighting, so no night materials.
 */
import { Part, type MaterialSpec, type V3, writeGlb } from './mesh'
import { finish, PALETTE } from './palette'
import { band, chamferedRect, footedLoft, footedWall, stations } from './bridge-kit'

// ---- terrain: Mapterhorn, decimetres above the river (196.52 m) --------------
// Rows run along the grid's z (south-east, toward Arizona) from -310, every
// 4 m; columns across x from -26 to 26, every 4 m.
const DEM_X0 = -26, DEM_Z0 = -310, DEM_STEP = 4
const DEM_ROWS = `
2540 2524 2522 2563 2661 2662 2664 2665 2667 2668 2668 2671 2688 2711
2509 2508 2509 2541 2664 2662 2664 2665 2667 2669 2669 2673 2689 2715
2487 2492 2498 2528 2660 2662 2664 2666 2667 2669 2671 2672 2693 2718
2468 2475 2482 2520 2659 2662 2665 2666 2668 2670 2669 2672 2698 2723
2447 2453 2467 2492 2649 2653 2651 2658 2659 2657 2602 2663 2697 2734
2422 2432 2450 2475 2598 2582 2601 2617 2625 2620 2600 2654 2692 2735
2400 2418 2438 2461 2501 2536 2552 2568 2583 2590 2584 2613 2686 2726
2392 2411 2430 2451 2471 2488 2504 2519 2535 2550 2560 2603 2686 2725
2391 2400 2415 2429 2440 2458 2474 2490 2506 2522 2538 2606 2689 2749
2386 2386 2395 2408 2417 2433 2450 2466 2482 2497 2516 2589 2683 2774
2373 2371 2378 2391 2402 2416 2430 2444 2458 2472 2485 2507 2585 2688
2352 2356 2361 2374 2386 2398 2410 2421 2432 2443 2455 2464 2474 2498
2326 2336 2343 2362 2377 2387 2396 2405 2415 2424 2433 2437 2442 2439
2291 2309 2323 2345 2361 2370 2378 2386 2394 2402 2410 2407 2412 2409
2265 2287 2307 2324 2337 2346 2354 2362 2369 2377 2384 2381 2379 2380
2238 2266 2297 2307 2316 2323 2331 2337 2344 2350 2356 2356 2350 2356
2222 2256 2288 2294 2303 2308 2312 2317 2323 2327 2330 2331 2324 2333
2221 2260 2276 2281 2294 2297 2299 2300 2301 2302 2304 2304 2299 2312
2225 2251 2259 2264 2278 2277 2276 2274 2273 2272 2270 2274 2278 2294
2224 2232 2241 2245 2257 2254 2250 2245 2242 2239 2236 2241 2253 2276
2209 2215 2224 2228 2226 2222 2217 2214 2210 2207 2205 2203 2234 2256
2190 2197 2201 2202 2190 2186 2184 2182 2180 2178 2177 2179 2208 2227
2160 2171 2178 2184 2184 2181 2175 2170 2164 2158 2154 2156 2177 2205
2129 2138 2155 2169 2170 2165 2158 2151 2144 2137 2132 2133 2152 2170
2104 2117 2139 2153 2150 2143 2136 2128 2121 2114 2109 2111 2130 2142
2081 2108 2130 2138 2130 2122 2115 2107 2100 2093 2086 2084 2099 2117
2062 2097 2118 2125 2112 2104 2096 2088 2080 2072 2064 2057 2067 2095
2052 2084 2105 2111 2097 2087 2077 2067 2057 2047 2037 2033 2046 2074
2028 2058 2084 2096 2079 2069 2055 2041 2026 2015 2009 2012 2031 2057
1993 2031 2042 2016 1983 1992 1983 1980 1981 1982 1983 1992 2012 2039
1944 1960 1963 1949 1887 1888 1902 1916 1931 1944 1958 1973 1987 2009
1872 1860 1869 1879 1867 1873 1886 1899 1913 1926 1941 1958 1971 1993
1804 1786 1793 1800 1808 1825 1839 1854 1870 1886 1904 1924 1950 1982
1684 1689 1686 1702 1727 1754 1779 1802 1828 1857 1883 1908 1936 1974
1631 1651 1668 1689 1715 1731 1758 1789 1820 1851 1881 1905 1935 1966
1630 1652 1669 1691 1713 1730 1760 1796 1833 1868 1900 1922 1946 1975
1620 1651 1675 1695 1720 1742 1775 1813 1850 1888 1922 1944 1964 1988
1641 1663 1688 1708 1730 1751 1784 1824 1863 1902 1938 1959 1981 2022
1656 1677 1705 1729 1745 1759 1790 1830 1870 1910 1946 1966 2012 2024
1656 1692 1721 1746 1758 1767 1795 1833 1871 1909 1944 1982 2022 2021
1659 1696 1721 1743 1757 1768 1796 1835 1872 1910 1946 2005 2020 2019
1659 1697 1718 1739 1762 1778 1805 1840 1877 1914 1951 2016 2017 2016
1632 1692 1716 1740 1767 1794 1824 1858 1892 1927 1963 2016 2016 2014
1621 1699 1719 1754 1784 1808 1838 1874 1908 1944 1983 2015 2013 2011
1605 1700 1726 1771 1802 1824 1858 1891 1928 1966 1999 2012 2011 2009
1594 1673 1719 1768 1813 1844 1872 1893 1932 1972 2008 2012 2010 2007
1607 1670 1732 1767 1800 1829 1863 1887 1925 1966 2004 2010 2009 2006
1594 1651 1708 1745 1777 1801 1842 1879 1920 1960 1998 2009 2008 2005
1583 1595 1648 1709 1737 1767 1804 1853 1904 1954 1995 2008 2007 2005
1544 1545 1596 1666 1720 1766 1794 1842 1890 1937 1986 2007 2006 2005
1523 1518 1550 1613 1688 1743 1775 1840 1892 1941 1988 2008 2005 2003
1490 1487 1496 1569 1654 1696 1714 1796 1879 1944 1994 2007 1998 1980
1453 1461 1464 1503 1591 1640 1650 1730 1816 1901 1976 1999 1979 1969
1432 1436 1443 1456 1517 1567 1587 1665 1749 1821 1825 1877 1932 1946
1411 1410 1421 1433 1465 1497 1520 1586 1647 1670 1603 1630 1700 1754
1380 1387 1396 1413 1447 1463 1467 1476 1497 1489 1471 1483 1501 1565
1339 1357 1359 1370 1405 1423 1423 1433 1436 1442 1437 1437 1427 1430
1282 1313 1328 1334 1334 1357 1365 1371 1385 1394 1363 1365 1384 1382
1134 1199 1201 1251 1267 1281 1317 1316 1318 1312 1308 1297 1289 1282
1059 1059 1065 1076 1100 1138 1189 1209 1209 1220 1222 1216 1212 1231
1040 1036 1027 1017 1006 1004 1036 1078 1093 1082 1064 1047 1048 1099
1018 1015 1007 999 987 975 964 988 1021 1034 1033 1019 1016 1019
982 990 985 979 967 955 943 936 969 998 1001 993 981 977
931 939 939 935 931 916 907 911 924 936 938 953 930 928
857 858 837 812 818 827 843 859 873 884 882 885 896 899
767 795 786 760 761 764 761 777 811 825 833 854 869 876
717 728 732 702 688 679 666 672 698 731 772 813 840 860
674 673 659 625 618 604 590 576 579 616 701 777 813 837
629 615 599 592 586 571 547 540 532 545 564 627 710 713
553 567 553 567 552 532 516 504 500 513 512 526 571 592
456 468 488 509 494 458 427 426 445 455 472 504 522 525
237 313 345 367 358 334 321 324 335 377 383 373 400 389
66 77 107 113 145 177 199 201 159 157 142 72 105 120
39 42 39 27 13 25 30 34 18 12 11 2 2 3
17 11 3 3 3 6 6 2 1 1 1 0 0 0
3 1 1 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0 0 0 0 0 0
1 0 1 1 0 0 0 0 0 0 0 0 0 0
8 6 19 7 0 0 0 1 1 1 0 0 1 1
29 40 71 36 4 2 3 17 30 32 25 26 38 51
101 107 94 55 27 19 60 112 127 133 132 132 138 142
146 119 95 72 91 150 197 218 239 236 231 219 207 202
196 142 129 159 188 235 266 278 278 267 253 247 237 226
251 239 239 264 262 289 316 318 303 287 273 267 258 251
339 350 347 325 304 325 377 418 430 408 392 400 426 419
429 442 472 475 474 515 567 596 590 581 581 587 599 597
564 582 607 620 616 626 628 633 635 638 658 720 744 763
610 628 646 648 646 652 712 751 770 767 789 803 811 811
648 657 662 665 677 746 801 822 836 846 847 842 842 838
676 685 707 751 794 819 845 851 855 869 886 888 886 886
707 725 764 795 827 859 883 913 923 921 923 925 939 936
761 767 786 818 859 889 937 975 983 978 971 978 972 969
783 793 815 861 908 935 980 997 1007 1011 1005 1002 995 990
825 854 886 925 967 999 1007 1015 1027 1038 1048 1037 1026 1026
896 933 966 991 1003 1017 1027 1032 1046 1061 1070 1069 1088 1090
974 991 1003 1017 1029 1040 1051 1060 1070 1077 1091 1108 1130 1137
1004 1016 1027 1041 1054 1071 1085 1098 1104 1125 1145 1147 1156 1178
1032 1058 1079 1090 1092 1108 1126 1144 1153 1160 1175 1173 1173 1192
1080 1085 1103 1120 1129 1148 1160 1173 1187 1200 1204 1206 1210 1230
1108 1117 1137 1165 1187 1196 1209 1221 1231 1237 1237 1240 1258 1284
1170 1172 1192 1229 1246 1253 1262 1277 1282 1280 1278 1311 1333 1350
1211 1210 1248 1298 1309 1311 1316 1334 1334 1356 1364 1363 1388 1413
1247 1250 1283 1336 1358 1356 1363 1372 1373 1384 1414 1419 1429 1450
1287 1285 1309 1364 1401 1404 1412 1426 1428 1440 1459 1479 1478 1477
1399 1422 1446 1467 1470 1470 1473 1481 1485 1493 1514 1518 1520 1511
1509 1513 1509 1511 1515 1521 1526 1550 1557 1561 1581 1596 1614 1616
1555 1551 1545 1545 1564 1578 1590 1622 1645 1669 1704 1745 1727 1693
1605 1606 1616 1649 1678 1665 1652 1661 1688 1690 1720 1798 1764 1707
1736 1759 1775 1773 1755 1744 1732 1719 1724 1714 1728 1769 1757 1735
1867 1866 1855 1799 1775 1775 1774 1772 1769 1770 1774 1794 1778 1773
1979 1972 1934 1828 1793 1792 1790 1788 1787 1784 1815 1864 1852 1848
2045 2067 1976 1892 1888 1891 1891 1891 1891 1889 1918 1958 1982 2004
2064 2083 2045 2045 2050 2044 2041 2037 2034 2029 2048 2064 2109 2138
2090 2106 2117 2140 2152 2156 2155 2150 2145 2140 2155 2189 2169 2176
2117 2124 2136 2151 2166 2181 2195 2209 2219 2227 2249 2258 2238 2260
2134 2144 2156 2169 2186 2205 2225 2246 2270 2295 2321 2327 2310 2322
2153 2162 2175 2196 2223 2253 2285 2317 2349 2381 2406 2407 2400 2392
2177 2193 2204 2220 2250 2279 2309 2339 2369 2398 2428 2453 2446 2411
2194 2210 2221 2238 2263 2288 2313 2338 2363 2389 2425 2471 2470 2432
2217 2223 2234 2252 2280 2303 2324 2345 2364 2383 2410 2473 2481 2462
2246 2251 2279 2303 2319 2340 2361 2380 2396 2410 2430 2477 2493 2485
2275 2311 2339 2350 2385 2406 2422 2436 2451 2465 2480 2505 2510 2502
2347 2374 2370 2377 2428 2446 2460 2475 2490 2505 2520 2544 2544 2573
2429 2419 2412 2422 2457 2476 2497 2517 2538 2558 2582 2616 2628 2661
2468 2459 2450 2460 2483 2513 2538 2563 2588 2613 2626 2650 2659 2679
2494 2491 2475 2490 2510 2553 2580 2605 2630 2643 2632 2663 2672 2682
2526 2513 2506 2510 2545 2604 2626 2646 2663 2658 2642 2675 2685 2692
2542 2532 2547 2553 2652 2671 2673 2675 2675 2674 2669 2677 2697 2700
2553 2558 2591 2605 2669 2675 2675 2676 2674 2674 2671 2679 2701 2703
2570 2574 2602 2648 2673 2675 2675 2675 2674 2673 2671 2683 2701 2702
2589 2602 2629 2667 2674 2674 2675 2675 2674 2673 2671 2681 2699 2698
2609 2622 2647 2667 2674 2674 2675 2674 2674 2672 2670 2678 2695 2695
2627 2630 2652 2669 2674 2674 2674 2674 2673 2672 2670 2675 2692 2691
2668 2645 2660 2670 2674 2674 2674 2674 2673 2672 2670 2673 2691 2689
`.trim().split('\n').map((r) => r.trim().split(' ').map((v) => Number(v) / 10))

/** The map's ground, metres above the river, at x across and y along (toward Nevada). */
function dem(x: number, y: number): number {
  const fx = Math.min(Math.max((x - DEM_X0) / DEM_STEP, 0), DEM_ROWS[0].length - 1.0001)
  const fz = Math.min(Math.max((-y - DEM_Z0) / DEM_STEP, 0), DEM_ROWS.length - 1.0001)
  const c = Math.floor(fx), r = Math.floor(fz), tx = fx - c, tz = fz - r
  const at = (rr: number, cc: number) => DEM_ROWS[rr][cc]
  return (at(r, c) * (1 - tx) + at(r, c + 1) * tx) * (1 - tz) + (at(r + 1, c) * (1 - tx) + at(r + 1, c + 1) * tx) * tz
}
const FOOT = 0.2
const ground = (x: number, y: number) => Math.max(0, dem(x, y) - FOOT)

// ---- the deck's line -----------------------------------------------------------

/** The deck's ends along the axis (OSM outline). */
const Y_NV = 296.8, Y_AZ = -290.3
const RIVER = 196.52
/** Lidar roadway, NAVD88, by distance from the Arizona end. */
const ROAD_LIDAR: [number, number][] = [
  [0, 464.0], [40, 464.4], [80, 464.83], [120, 465.27], [160, 465.73], [200, 466.03], [240, 466.14],
  [282, 466.0], [322, 465.68], [362, 465.26], [401, 464.84], [441, 464.43], [506, 463.75], [546, 463.49], [587, 463.22],
]
function road(y: number): number {
  const s = y - Y_AZ
  if (s <= 0) return ROAD_LIDAR[0][1] - RIVER
  for (let i = 1; i < ROAD_LIDAR.length; i++) {
    const [s0, h0] = ROAD_LIDAR[i - 1], [s1, h1] = ROAD_LIDAR[i]
    if (s <= s1) return h0 + ((h1 - h0) * (s - s0)) / (s1 - s0) - RIVER
  }
  return ROAD_LIDAR[ROAD_LIDAR.length - 1][1] - RIVER
}

const HALF_W = 13.2 // deck edge, OSM outline
const GIRDER = 3.2 // road surface to soffit
const PARAPET = 1.1
const CAP = 2.0 // cap beam depth under the soffit

/** Bents: 16 equal spans between the abutments. */
const SPAN = (Y_NV - Y_AZ) / 16
const BENTS = Array.from({ length: 15 }, (_, i) => Y_NV - (i + 1) * SPAN)

// ---- the arch --------------------------------------------------------------------

const Y_CROWN = Y_NV - 9.5 * SPAN // -51.8: middle of the tenth span from Nevada
const HALF_SPAN = 161.5
const CROWN_C = 258.5 // rib centreline at the crown: intrados 256 (840 ft), depth 5
const RISE = 84.4
const K = 1.25 // catenary-like: steeper toward the springings
const RIB_X = 8.5, RIB_W = 6.1
function archC(y: number): number {
  const u = Math.min(1, Math.abs(y - Y_CROWN) / HALF_SPAN)
  return CROWN_C - RISE * ((Math.cosh(K * u) - 1) / (Math.cosh(K) - 1))
}
function depth(y: number): number {
  const u = Math.min(1, Math.abs(y - Y_CROWN) / HALF_SPAN)
  return 5 + 5 * u * u
}
const extrados = (y: number) => archC(y) + depth(y) / 2
const intrados = (y: number) => archC(y) - depth(y) / 2

// ---- materials -------------------------------------------------------------------

const CONCRETE: MaterialSpec = finish('tillman-concrete', 0xe6e0d5)
const DECK: MaterialSpec = finish('tillman-deck', 0xdcdad4)
const WALK: MaterialSpec = finish('tillman-walkway', 0xc4bdb1)
const STEEL: MaterialSpec = { ...PALETTE.metal, color: 0xa9a59c }

const conc = new Part(), deck = new Part(), walk = new Part(), steel = new Part()

/** A closed box, x0..x1 by y0..y1, z0..z1. */
function box(p: Part, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number) {
  const ys = [y0, y1]
  band(p, x0, x1, ys, () => z1, () => z0)
}

// ---- ribs and struts -------------------------------------------------------------

function ribs() {
  // Each rib runs until it disappears into the canyon wall on its own line.
  const y0 = Y_CROWN - HALF_SPAN, y1 = Y_CROWN + HALF_SPAN
  for (const xc of [-RIB_X, RIB_X]) {
    const xa = xc - RIB_W / 2, xb = xc + RIB_W / 2
    const buried = (y: number) => intrados(y) + 1 < Math.min(ground(xa, y), ground(xb, y)) && extrados(y) < Math.max(ground(xa, y), ground(xb, y)) + 1
    let lo = y0, hi = y1
    while (lo < Y_CROWN && buried(lo + 2)) lo += 2
    while (hi > Y_CROWN && buried(hi - 2)) hi -= 2
    // Finer near the crown and the springings, where the curve turns.
    const ys = stations(lo, hi, 6.5)
    band(conc, xa, xb, ys, extrados, intrados, { out: true, in: true, top: true, bottom: true, ends: true })
  }
  // Steel struts between the ribs, at every bent and midway, as the photos from below show.
  for (let y = Y_CROWN - 140; y <= Y_CROWN + 140.1; y += SPAN / 2) {
    const c = archC(y)
    box(steel, -RIB_X + RIB_W / 2, RIB_X - RIB_W / 2, y - 0.8, y + 0.8, c - 0.9, c + 0.9)
  }
}

// ---- bents: paired columns and cap beams -------------------------------------------

const COL_ALONG = 3.4, COL_ACROSS = 4.6
function bents() {
  for (const y of BENTS) {
    const top = road(y) - GIRDER - CAP
    const onArch = Math.abs(y - Y_CROWN) < HALF_SPAN - 20
    for (const xc of [-RIB_X, RIB_X]) {
      const plan = (grow: number) => chamferedRect(xc - COL_ACROSS / 2 - grow, xc + COL_ACROSS / 2 + grow, y - COL_ALONG / 2 - grow, y + COL_ALONG / 2 + grow, 0.5)
      if (onArch) {
        const base = Math.min(extrados(y - COL_ALONG / 2), extrados(y + COL_ALONG / 2)) - 0.3
        footedLoft(conc, ground, [{ plan: plan(0), z: base }, { plan: plan(0), z: top }], 6, false)
      } else {
        // Tall approach columns flare a little toward the foot.
        const g = ground(xc, y)
        const flare = Math.max(0, (top - g) * 0.012)
        footedLoft(conc, ground, [{ plan: plan(flare), z: 'ground' }, { plan: plan(0), z: top }], 3, false)
      }
    }
    box(conc, -RIB_X - COL_ACROSS / 2 - 0.6, RIB_X + COL_ACROSS / 2 + 0.6, y - COL_ALONG / 2, y + COL_ALONG / 2, top, top + CAP + 0.05)
  }
}

// ---- the deck ------------------------------------------------------------------------

function deckStructure() {
  const ys = stations(Y_AZ, Y_NV, 8)
  // Parapets with the girder fascias below them, both edges: no slab across the road.
  const fascia = (y: number) => road(y) - GIRDER
  const pTop = (y: number) => road(y) + PARAPET
  band(deck, HALF_W - 0.5, HALF_W, ys, pTop, fascia, { out: true, in: true, top: true, ends: true })
  band(deck, -HALF_W, -HALF_W + 0.5, ys, pTop, fascia, { out: true, in: true, top: true, ends: true })
  // The walkway on the upstream side: its barrier against the road, and its surface.
  band(deck, 10.2, 10.65, ys, pTop, (y) => road(y) - 0.4, { out: true, in: true, top: true, ends: true })
  band(walk, 10.65, HALF_W - 0.5, ys, (y) => road(y) + 0.15, (y) => road(y) - 0.4, { top: true, ends: true })
  // Soffit: a thin slab GIRDER under the road, where the canyon has dropped away below it.
  const clear = (y: number) => [-HALF_W, -6, 0, 6, HALF_W].every((x) => ground(x, y) < fascia(y) - 0.6)
  let lo = Y_AZ, hi = Y_NV
  while (!clear(lo) && lo < 0) lo += 2
  while (!clear(hi) && hi > 0) hi -= 2
  const sy = stations(lo, hi, 8)
  band(deck, -HALF_W + 0.5, HALF_W - 0.5, sy, (y) => fascia(y) + 0.25, fascia, { top: true, bottom: true })
  // Abutment faces closing the soffit's ends against the canyon rims.
  for (const [y, s] of [[lo, -1], [hi, 1]] as [number, number][]) {
    const top = (x: number, yy: number) => Math.max(fascia(y) + 0.25, ground(x, yy))
    const n: V3 = [0, -s, 0]
    footedWall(conc, s < 0 ? [-HALF_W, y] : [HALF_W, y], s < 0 ? [HALF_W, y] : [-HALF_W, y], ground, top, n, 3)
  }
}

ribs()
bents()
deckStructure()

const parts = [
  { part: conc, material: CONCRETE },
  { part: deck, material: DECK },
  { part: walk, material: WALK },
  { part: steel, material: STEEL },
].filter(({ part }) => part.triangles)

console.log(parts.map(({ part, material }) => `${material.name} ${part.triangles}`).join(', '))
const triangles = parts.reduce((s, { part }) => s + part.triangles, 0)
if (triangles > 6500) throw new Error(`tillman bridge: ${triangles} triangles`)
const glb = writeGlb("Mike O'Callaghan–Pat Tillman Memorial Bridge", parts, { license: 'CC0-1.0', frame: 'Y up, -Z north, +X east, metres; origin at the ground anchor' })
if (glb.length > 250 * 1024) throw new Error(`tillman bridge: ${glb.length} bytes`)
await Bun.write(new URL('../models/lv-mike-ocallaghan-pat-tillman-bridge.glb', import.meta.url).pathname, glb)
console.log(`models/lv-mike-ocallaghan-pat-tillman-bridge.glb: ${triangles} triangles, ${(glb.length / 1024).toFixed(1)} KiB`)
