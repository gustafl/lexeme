USE [master]
GO
/****** Object:  Database [Lexeme]    Script Date: 2018-04-30 00:33:41 ******/
CREATE DATABASE [Lexeme]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Lexeme', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\Lexeme.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Lexeme_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\Lexeme_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [Lexeme] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Lexeme].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Lexeme] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Lexeme] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Lexeme] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Lexeme] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Lexeme] SET ARITHABORT OFF 
GO
ALTER DATABASE [Lexeme] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Lexeme] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Lexeme] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Lexeme] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Lexeme] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Lexeme] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Lexeme] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Lexeme] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Lexeme] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Lexeme] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Lexeme] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Lexeme] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Lexeme] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Lexeme] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Lexeme] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Lexeme] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Lexeme] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Lexeme] SET RECOVERY FULL 
GO
ALTER DATABASE [Lexeme] SET  MULTI_USER 
GO
ALTER DATABASE [Lexeme] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Lexeme] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Lexeme] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Lexeme] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Lexeme] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'Lexeme', N'ON'
GO
ALTER DATABASE [Lexeme] SET QUERY_STORE = OFF
GO
USE [Lexeme]
GO
ALTER DATABASE SCOPED CONFIGURATION SET IDENTITY_CACHE = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION SET LEGACY_CARDINALITY_ESTIMATION = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET LEGACY_CARDINALITY_ESTIMATION = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET MAXDOP = 0;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET MAXDOP = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET PARAMETER_SNIFFING = ON;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET PARAMETER_SNIFFING = PRIMARY;
GO
ALTER DATABASE SCOPED CONFIGURATION SET QUERY_OPTIMIZER_HOTFIXES = OFF;
GO
ALTER DATABASE SCOPED CONFIGURATION FOR SECONDARY SET QUERY_OPTIMIZER_HOTFIXES = PRIMARY;
GO
USE [Lexeme]
GO
/****** Object:  Table [dbo].[grammatical_category]    Script Date: 2018-04-30 00:33:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grammatical_category](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NULL,
	[lexical_category] [int] NOT NULL,
	[subgroup] [bit] NOT NULL,
 CONSTRAINT [PK_grammatical_category] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[grammeme]    Script Date: 2018-04-30 00:33:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[grammeme](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[grammatical_category] [int] NOT NULL,
	[name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_grammeme] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[inflection]    Script Date: 2018-04-30 00:33:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[inflection](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[lexeme] [int] NOT NULL,
	[spelling] [nvarchar](100) NOT NULL,
	[pronounciation] [nvarchar](100) NULL,
 CONSTRAINT [PK_inflection] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[inflection_grammatical_category]    Script Date: 2018-04-30 00:33:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[inflection_grammatical_category](
	[inflection] [int] NOT NULL,
	[grammatical_category] [int] NOT NULL,
 CONSTRAINT [PK_inflection_grammatical_category] PRIMARY KEY CLUSTERED 
(
	[inflection] ASC,
	[grammatical_category] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[language]    Script Date: 2018-04-30 00:33:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[language](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NOT NULL,
	[code] [char](2) NOT NULL,
 CONSTRAINT [PK_language] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_language] UNIQUE NONCLUSTERED 
(
	[code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[language_grammatical_category]    Script Date: 2018-04-30 00:33:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[language_grammatical_category](
	[language] [int] NOT NULL,
	[grammatical_category] [int] NOT NULL,
 CONSTRAINT [PK_language_grammatical_category] PRIMARY KEY CLUSTERED 
(
	[language] ASC,
	[grammatical_category] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[language_grammeme]    Script Date: 2018-04-30 00:33:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[language_grammeme](
	[language] [int] NOT NULL,
	[grammeme] [int] NOT NULL,
 CONSTRAINT [PK_language_grammeme] PRIMARY KEY CLUSTERED 
(
	[language] ASC,
	[grammeme] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lexeme]    Script Date: 2018-04-30 00:33:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lexeme](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[language] [int] NOT NULL,
	[lexical_category] [int] NOT NULL,
	[spelling] [varchar](100) NOT NULL,
	[pronounciation] [varchar](100) NOT NULL,
 CONSTRAINT [PK_lexeme] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lexeme_grammatical_category]    Script Date: 2018-04-30 00:33:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lexeme_grammatical_category](
	[lexeme] [int] NOT NULL,
	[grammatical_category] [int] NOT NULL,
 CONSTRAINT [PK_lexeme_grammatical_category] PRIMARY KEY CLUSTERED 
(
	[lexeme] ASC,
	[grammatical_category] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[lexical_category]    Script Date: 2018-04-30 00:33:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[lexical_category](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_lexical_category] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[translation]    Script Date: 2018-04-30 00:33:41 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[translation](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[lexeme] [int] NOT NULL,
	[language] [int] NOT NULL,
	[translation] [varchar](100) NOT NULL,
 CONSTRAINT [PK_translation] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [IX_translation] UNIQUE NONCLUSTERED 
(
	[lexeme] ASC,
	[language] ASC,
	[translation] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[grammeme]  WITH CHECK ADD  CONSTRAINT [FK_grammeme_grammatical_category] FOREIGN KEY([grammatical_category])
REFERENCES [dbo].[grammatical_category] ([id])
GO
ALTER TABLE [dbo].[grammeme] CHECK CONSTRAINT [FK_grammeme_grammatical_category]
GO
ALTER TABLE [dbo].[inflection]  WITH CHECK ADD  CONSTRAINT [FK_inflection_lexeme] FOREIGN KEY([lexeme])
REFERENCES [dbo].[lexeme] ([id])
GO
ALTER TABLE [dbo].[inflection] CHECK CONSTRAINT [FK_inflection_lexeme]
GO
ALTER TABLE [dbo].[inflection_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_inflection_grammatical_category_grammatical_category] FOREIGN KEY([grammatical_category])
REFERENCES [dbo].[grammatical_category] ([id])
GO
ALTER TABLE [dbo].[inflection_grammatical_category] CHECK CONSTRAINT [FK_inflection_grammatical_category_grammatical_category]
GO
ALTER TABLE [dbo].[inflection_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_inflection_grammatical_category_inflection] FOREIGN KEY([inflection])
REFERENCES [dbo].[inflection] ([id])
GO
ALTER TABLE [dbo].[inflection_grammatical_category] CHECK CONSTRAINT [FK_inflection_grammatical_category_inflection]
GO
ALTER TABLE [dbo].[language_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_language_grammatical_category_grammatical_category] FOREIGN KEY([grammatical_category])
REFERENCES [dbo].[grammatical_category] ([id])
GO
ALTER TABLE [dbo].[language_grammatical_category] CHECK CONSTRAINT [FK_language_grammatical_category_grammatical_category]
GO
ALTER TABLE [dbo].[language_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_language_grammatical_category_language] FOREIGN KEY([language])
REFERENCES [dbo].[language] ([id])
GO
ALTER TABLE [dbo].[language_grammatical_category] CHECK CONSTRAINT [FK_language_grammatical_category_language]
GO
ALTER TABLE [dbo].[language_grammeme]  WITH CHECK ADD  CONSTRAINT [FK_language_grammeme_grammeme] FOREIGN KEY([grammeme])
REFERENCES [dbo].[grammeme] ([id])
GO
ALTER TABLE [dbo].[language_grammeme] CHECK CONSTRAINT [FK_language_grammeme_grammeme]
GO
ALTER TABLE [dbo].[language_grammeme]  WITH CHECK ADD  CONSTRAINT [FK_language_grammeme_language] FOREIGN KEY([language])
REFERENCES [dbo].[language] ([id])
GO
ALTER TABLE [dbo].[language_grammeme] CHECK CONSTRAINT [FK_language_grammeme_language]
GO
ALTER TABLE [dbo].[lexeme]  WITH CHECK ADD  CONSTRAINT [FK_lexeme_language] FOREIGN KEY([language])
REFERENCES [dbo].[language] ([id])
GO
ALTER TABLE [dbo].[lexeme] CHECK CONSTRAINT [FK_lexeme_language]
GO
ALTER TABLE [dbo].[lexeme]  WITH CHECK ADD  CONSTRAINT [FK_lexeme_lexical_category] FOREIGN KEY([lexical_category])
REFERENCES [dbo].[lexical_category] ([id])
GO
ALTER TABLE [dbo].[lexeme] CHECK CONSTRAINT [FK_lexeme_lexical_category]
GO
ALTER TABLE [dbo].[lexeme_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_lexeme_grammatical_category_grammatical_category] FOREIGN KEY([grammatical_category])
REFERENCES [dbo].[grammatical_category] ([id])
GO
ALTER TABLE [dbo].[lexeme_grammatical_category] CHECK CONSTRAINT [FK_lexeme_grammatical_category_grammatical_category]
GO
ALTER TABLE [dbo].[lexeme_grammatical_category]  WITH CHECK ADD  CONSTRAINT [FK_lexeme_grammatical_category_lexeme] FOREIGN KEY([lexeme])
REFERENCES [dbo].[lexeme] ([id])
GO
ALTER TABLE [dbo].[lexeme_grammatical_category] CHECK CONSTRAINT [FK_lexeme_grammatical_category_lexeme]
GO
ALTER TABLE [dbo].[translation]  WITH CHECK ADD  CONSTRAINT [FK_translation_language] FOREIGN KEY([language])
REFERENCES [dbo].[language] ([id])
GO
ALTER TABLE [dbo].[translation] CHECK CONSTRAINT [FK_translation_language]
GO
ALTER TABLE [dbo].[translation]  WITH CHECK ADD  CONSTRAINT [FK_translation_lexeme] FOREIGN KEY([lexeme])
REFERENCES [dbo].[lexeme] ([id])
GO
ALTER TABLE [dbo].[translation] CHECK CONSTRAINT [FK_translation_lexeme]
GO
USE [master]
GO
ALTER DATABASE [Lexeme] SET  READ_WRITE 
GO
