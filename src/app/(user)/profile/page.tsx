// pages/profile.js
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LeetCode, { MatchedUser } from 'leetcode-query'
import Link from "next/link";

export default async function ProfilePage() {
  const user = await auth()
  if (!user) {
    redirect('/signin')
  }
  if (!user.user.leetcode_username) {
    
  }
  const leetcode = new LeetCode()
  const userData = await leetcode.user(user.user.leetcode_username as string)

  const { matchedUser, recentSubmissionList } = userData;
  const { profile, submitStats, upcomingBadges } = matchedUser as MatchedUser;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-6">
        {/* Profile Header */}
        <Card className="mb-6 bg-primary/10">
          <CardContent className="flex flex-col md:flex-row items-center gap-6 pt-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.userAvatar} alt={profile.realName} />
              <AvatarFallback>{profile.realName[0]}</AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-bold">{profile.realName} ({matchedUser.username})</h1>
              <p className="text-muted-foreground">{profile.aboutMe}</p>
              <div className="flex gap-2 mt-2">
                {profile.company && <Badge>{profile.company}</Badge>}
                {profile.countryName && <Badge>{profile.countryName}</Badge>}
              </div>
              <div className="mt-2">
                <Link href={matchedUser.githubUrl} target="_blank" className="text-primary hover:underline">GitHub</Link>
                {profile.websites?.map((site, i) => (
                  <a key={i} href={site} target="_blank" className="ml-4 text-primary hover:underline">Portfolio</a>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Ranking: {profile.ranking.toLocaleString()}</p>
              <p>Contributions: {matchedUser.contributions.points} points</p>
              {submitStats.acSubmissionNum.map((stat) => (
                stat.difficulty === "All" ? null : (
                  <div key={stat.difficulty} className="mt-2">
                    <p>{stat.difficulty}: {stat.count}/{stat.submissions}</p>
                    <Progress value={(stat.count / stat.submissions) * 100} className="mt-1" />
                  </div>
                )
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {upcomingBadges.map((badge) => (
                  <div key={badge.name} className="flex items-center gap-2">
                    <img src={badge.icon} alt={badge.name} className="w-8 h-8" />
                    <p className="text-sm">{badge.name}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Submissions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {recentSubmissionList.slice(0, 5).map((submission) => (
                <div key={submission.timestamp} className="mb-2">
                  <p>{submission.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.statusDisplay} • {submission.lang}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}