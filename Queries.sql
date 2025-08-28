select player_name, position, 
  CAST(jersey_number AS INTEGER) AS jersey_number,
  CAST(week AS INTEGER) AS week,
  headshot_url, 
case
    when position = 'QB' then 'Offense'
    when position = 'RB' then 'Offense'
    when position = 'WR' then 'Offense'
    when position = 'TE' then 'Offense'
    when position = 'K' then 'Special Teams'
    when position = 'OL' then 'Offense'
    when position = 'P' then 'Special Teams'
    when position = 'LS' then 'Special Teams'
    when position = 'DL' then 'Defense'
    when position = 'LB' then 'Defense'
    when position = 'DB' then 'Defense'
end as team_side
from roster;


select distinct position
from roster;