import React from 'react';
import {
  Briefcase,
  Code2,
  Award,
  Github,
  Trophy,
  Eye,
} from 'lucide-react';
import StatsCard from '../../../components/ui/StatsCard';

/**
 * Builds stat metrics from the profile object.
 */
const buildStatsData = (profile) => {
  const projectCount = profile?.projects?.length ?? 0;
  const skillCount = profile?.skills?.length ?? 0;
  const certificationCount = profile?.certifications?.length ?? 0;
  const hasGithub = Boolean(profile?.github?.trim?.());
  const hasLeetcode = Boolean(profile?.leetcode?.trim?.());

  return [
    {
      id: 'projects',
      title: 'Projects Built',
      value: String(projectCount),
      icon: Briefcase,
      trend: projectCount > 0 ? `${projectCount} active` : 'None yet',
      trendType: projectCount > 0 ? 'up' : 'neutral',
      description: 'Active professional repositories',
    },
    {
      id: 'skills',
      title: 'Verified Skills',
      value: String(skillCount),
      icon: Code2,
      trend: skillCount > 0 ? `${skillCount} listed` : 'Add skills',
      trendType: skillCount > 0 ? 'up' : 'neutral',
      description: 'Core languages and frameworks',
    },
    {
      id: 'certifications',
      title: 'Certifications',
      value: String(certificationCount),
      icon: Award,
      trend: certificationCount > 0 ? 'Verified' : 'None yet',
      trendType: certificationCount > 0 ? 'up' : 'neutral',
      description: 'Verified educational credentials',
    },
    {
      id: 'github',
      title: 'GitHub Repos',
      value: hasGithub ? 'Linked' : '0',
      icon: Github,
      trend: hasGithub ? 'Connected' : 'Not linked',
      trendType: hasGithub ? 'up' : 'neutral',
      description: 'Open source contributions',
    },
    {
      id: 'leetcode',
      title: 'LeetCode Solved',
      value: hasLeetcode ? 'Linked' : '0',
      icon: Trophy,
      trend: hasLeetcode ? 'Connected' : 'Not linked',
      trendType: hasLeetcode ? 'up' : 'neutral',
      description: 'Algorithmic problem score',
    },
    {
      id: 'views',
      title: 'Profile Views',
      value: String(profile?.profileViews ?? 0),
      icon: Eye,
      trend: profile?.profileViews ? 'This week' : 'No data',
      trendType: 'neutral',
      description: 'Weekly search impressions',
    },
  ];
};

/**
 * StatsGrid Component
 * Renders a responsive grid mapping metric objects into StatsCard components.
 * Receives profile data via props — does not fetch.
 */
export default function StatsGrid({ profile, loading = false }) {
  const statsData = buildStatsData(profile);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat) => (
        <StatsCard
          key={stat.id}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          trend={stat.trend}
          trendType={stat.trendType}
          description={stat.description}
          loading={loading}
        />
      ))}
    </div>
  );
}
