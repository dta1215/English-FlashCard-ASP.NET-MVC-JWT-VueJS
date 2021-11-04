using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using vueWithJWT.DB;

namespace vueWithJWT.Repository
{
	public class IRespos<TEntity> where TEntity : class
	{
		internal FlashCardManagement context;
		internal DbSet<TEntity> dbset;

		public IRespos(FlashCardManagement _context)
		{
			this.context = _context;
			dbset = _context.Set<TEntity>();
		}

		public virtual IEnumerable<TEntity> GetAll(string tableInclude = "")
		{
			return dbset.Include(tableInclude).ToList();
		}

		public virtual TEntity getByID(object id)
		{
			return dbset.Find(id);
		}

		public virtual void Delete(object id)
		{
			TEntity select = dbset.Find(id);
			if (context.Entry(select).State == EntityState.Detached)
			{
				dbset.Attach(select);
			}
			dbset.Remove(select);
		}
	}
}